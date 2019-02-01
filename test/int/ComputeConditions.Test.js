/* global artifacts, contract, before, describe, it, assert, before */
/* eslint-disable no-console, max-len */
const OceanToken = artifacts.require('OceanToken.sol')
const ServiceExecutionAgreement = artifacts.require('ServiceExecutionAgreement.sol')
const PaymentConditions = artifacts.require('PaymentConditions.sol')
const AccessConditions = artifacts.require('AccessConditions.sol')
const ComputeConditions = artifacts.require('ComputeConditions.sol')
const testUtils = require('../helpers/utils')
const { hashAgreement } = require('../helpers/hashAgreement.js')
const web3 = testUtils.getWeb3()

contract('ComputeConditions', (accounts) => {
    describe('Test integration of On-Premise compute conditions in SEA', () => {
        let token, sea, paymentConditions, accessConditions, computeConditions, valuesHashList, serviceId, conditionKeys
        let funcFingerPrints, contracts, agreementId, slaMsgHash, signature, algorithmHash
        const publisher = accounts[0]
        const datascientist = accounts[1]
        // for more info about the Compute use case dependencyBits: https://github.com/oceanprotocol/dev-ocean/pull/85
        const fulfillmentIndices = [3, 4] // Root Conditions
        const fulfilmentOperator = 1 // OR
        const dependencies = [0, 1, 4, 16, 3]
        const price = 5 // 5 OCN tokens
        const timeouts = [0, 0, 0, 0, 100]
        const did = testUtils.generateId()
        const serviceTemplateId = testUtils.generateId()
        agreementId = testUtils.generateId()
        const algorithm = 'THIS IS FAKE CODE foo=Hello World!'

        before(async () => {
            token = await OceanToken.new()
            await token.initialize(accounts[0])
            await token.mint(publisher, 1000)
            await token.mint(datascientist, 1000)

            sea = await ServiceExecutionAgreement.new()
            paymentConditions = await PaymentConditions.new()
            await paymentConditions.initialize(sea.address, token.address)
            accessConditions = await AccessConditions.new()
            await accessConditions.initialize(sea.address)
            computeConditions = await ComputeConditions.new()
            await computeConditions.initialize(sea.address)

            // conditions
            contracts = [
                paymentConditions.address,
                computeConditions.address,
                accessConditions.address,
                paymentConditions.address,
                paymentConditions.address
            ]

            funcFingerPrints = [
                testUtils.getSelector(web3, paymentConditions, 'lockPayment'),
                testUtils.getSelector(web3, computeConditions, 'fulfillUpload'),
                testUtils.getSelector(web3, accessConditions, 'grantAccess'),
                testUtils.getSelector(web3, paymentConditions, 'releasePayment'),
                testUtils.getSelector(web3, paymentConditions, 'refundPayment')
            ]
            valuesHashList = [
                testUtils.valueHash(['bytes32', 'uint256'], [did, price]),
                testUtils.valueHash(['bool'], [true]),
                testUtils.valueHash(['bytes32'], [did]),
                testUtils.valueHash(['bytes32', 'uint256'], [did, price]),
                testUtils.valueHash(['bytes32', 'uint256'], [did, price])
            ]
            // create new on-premise compute template
            const createAgreementTemplate = await sea.setupTemplate(
                serviceTemplateId,
                contracts,
                funcFingerPrints,
                dependencies,
                fulfillmentIndices,
                fulfilmentOperator, { from: publisher }
            )
            let { templateId } = testUtils.getEventArgsFromTx(createAgreementTemplate, 'TemplateSetup')
            // create new agreement instance

            conditionKeys = testUtils.generateConditionsKeys(templateId, contracts, funcFingerPrints)
            slaMsgHash = hashAgreement(
                templateId,
                conditionKeys,
                valuesHashList,
                timeouts,
                agreementId
            )
            signature = await web3.eth.sign(slaMsgHash, datascientist)
            serviceId = await testUtils.initializeAgreement(
                sea, templateId, signature,
                datascientist, valuesHashList, timeouts,
                agreementId, did, { from: publisher }
            )
            assert.strictEqual(serviceId, agreementId, 'Error: unable to retrieve service agreement Id')
            await token.approve(paymentConditions.address, 200, { from: datascientist })
        })

        it('Data Scientist should be able to lock payment for on-premise compute', async () => {
            await paymentConditions.lockPayment(serviceId, did, price, { from: datascientist })
            const locked = await sea.getConditionStatus(agreementId, conditionKeys[0])
            assert.strictEqual(locked.toNumber(), 1, 'Error: Unable to lock payment!')
        })

        it('Data scientist should be able to submit algorithm signature', async () => {
            algorithmHash = web3.utils.soliditySha3({ type: 'string', value: algorithm }).toString('hex')
            const signature = await web3.eth.sign(algorithmHash, datascientist)
            const submitAlgorithmSignature = await computeConditions.submitHashSignature(agreementId, signature, { from: datascientist })
            const isSignatureSubmitted = testUtils.getEventArgsFromTx(submitAlgorithmSignature, 'HashSignatureSubmitted')
            assert.strictEqual(isSignatureSubmitted.state, true, 'Error: Unable to submit signature')
        })

        it('Service publisher should be able to submit algorithm hash and start computation', async () => {
            const submitAlgorithmHash = await computeConditions.submitAlgorithmHash(agreementId, algorithmHash, { from: publisher })
            const isHashSubmitted = testUtils.getEventArgsFromTx(submitAlgorithmHash, 'HashSubmitted')
            assert.strictEqual(isHashSubmitted.state, true, 'Error: Unable to submit algorithm hash')
            const fulfillUploadConditionState = await sea.getConditionStatus(agreementId, conditionKeys[1])
            assert.strictEqual(fulfillUploadConditionState.toNumber(), 1, 'Error: unable to fulfill the upload condition')
        })

        it('Service publisher should be able to grant access for derived asset to the data scientist', async () => {
            await accessConditions.grantAccess(agreementId, did, { from: publisher })
            const fulfillAccessConditionState = await sea.getConditionStatus(agreementId, conditionKeys[2])
            assert.strictEqual(fulfillAccessConditionState.toNumber(), 1, 'Error: unable to fulfill granted access to derived asset condition')
        })

        it('Service publisher should be able to release payment', async () => {
            await paymentConditions.releasePayment(agreementId, did, price, { from: publisher })
            const fulfillReleasePaymentConditionState = await sea.getConditionStatus(agreementId, conditionKeys[3])
            assert.strictEqual(fulfillReleasePaymentConditionState.toNumber(), 1, 'Error: unable to fulfill release payment condition')
        })

        it('data scientist should not be able to make refund payment', async () => {
            await paymentConditions.refundPayment(agreementId, did, price, { from: datascientist })
            const fulfillRefundPaymentConditionState = await sea.getConditionStatus(agreementId, conditionKeys[4])
            assert.strictEqual(fulfillRefundPaymentConditionState.toNumber(), 0, 'Error: unable to fulfill refund payment condition')
        })

        it('Service agreement should be fulfilled', async () => {
            await sea.fulfillAgreement(agreementId, { from: publisher })
            const agreementFulfilled = await sea.isAgreementFulfilled(agreementId, { from: publisher })
            assert.strictEqual(agreementFulfilled, true, 'Error: unable to fulfill or terminate the agreement')
        })
    })
})
