import React, { Component } from 'react'
import Input from '../../components/atoms/Form/Input'
import AgreementItem from './AgreementItem'
import styles from './Agreement.module.scss'

class AgreementList extends Component {
    state = {
        stackId: null,
        getAgreementIdsKey: null,
        getAgreementListSizeKey: null,
        value: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }

    componentDidMount() {
        this.getAgreements()
    }

    getAgreements = () => {
        const { drizzle } = this.props
        const contract = drizzle.contracts.AgreementStoreManager

        // const getDIDRegisterIdsKey = contract.methods['getDIDRegisterIds'].cacheCall()
        const getAgreementListSizeKey = contract.methods['getAgreementListSize'].cacheCall()

        // let drizzle know we want to watch the `myString` method

        // save the `dataKey` to local component state for later reference
        this.setState({
            getAgreementListSizeKey
        })
    }

    // handleChange = event => {
    //     this.setState({ value: event.target.value })
    // }
    //
    // handleKeyDown = e => {
    //     // if the enter key is pressed, set the value with the string
    //     if (e.keyCode === 13) {
    //         this.registerAttribute(e.target.value)
    //     }
    // }
    //
    // registerAttribute = value => {
    //     const { drizzle, drizzleState } = this.props
    //     const contract = drizzle.contracts.DIDRegistry
    //
    //     // let drizzle know we want to call the `set` method with `value`
    //     const stackId = contract.methods['registerAttribute'].cacheSend(
    //         this.state.value,
    //         '0x0000000000000000000000000000000000000000000000000000000000000003',
    //         'some value',
    //         { from: drizzleState.accounts[0] }
    //     )
    //     this.setState({
    //         stackId
    //     })
    //     this.getDIDs()
    // }
    //
    // getTxStatus = () => {
    //     // get the transaction states from the drizzle state
    //     const { transactions, transactionStack } = this.props.drizzleState
    //
    //     // get the transaction hash using our saved `stackId`
    //     const txHash = transactionStack[this.state.stackId]
    //
    //     // if transaction hash does not exist, don't display anything
    //     if (!txHash || !transactions[txHash]) return null
    //
    //     // otherwise, return the transaction status
    //     return `Transaction status: ${transactions[txHash].status}`
    // }

    render() {
        // get the contract state from drizzleState
        const { AgreementStoreManager } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        // const didRegisterIds = AgreementStoreManager.getDIDRegisterIds[this.state.getDIDRegisterIdsKey]
        const agreementListSize = AgreementStoreManager.getAgreementListSize[this.state.getAgreementListSizeKey]

        return (
            <div className={styles.wrapper}>
                <p>AgreementList Size: {agreementListSize && agreementListSize.value}</p>
                {
                    // didRegisterIds && didRegisterIds.value && didRegisterIds.value.map(did => (
                    //     <AgreementItem
                    //         key={did}
                    //         did={did}
                    //         drizzle={this.props.drizzle}
                    //         drizzleState={this.props.drizzleState}
                    //     />
                    // ))
                }
            </div>
        )
    }
}

export default AgreementList
