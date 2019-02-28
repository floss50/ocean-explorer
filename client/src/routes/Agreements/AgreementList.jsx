import React from 'react'
import Input from '../../components/atoms/Form/Input'
import AgreementItem from './AgreementItem'
import styles from './Agreement.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'

class AgreementList extends DrizzleComponent {
    state = {
        stackId: null,
        getAgreementIdsKey: null,
        getAgreementListSizeKey: null,
        agreementIdValue: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }

    componentDidMount() {
        this.getAgreements()
    }

    getAgreements = () => {
        const { drizzle } = this.props
        const contract = drizzle.contracts.AgreementStoreManager

        const getAgreementListSizeKey = contract.methods['getAgreementListSize'].cacheCall()
        const getAgreementIdsKey = contract.methods['getAgreementIds'].cacheCall()

        this.setState({
            getAgreementListSizeKey,
            getAgreementIdsKey
        })
    }

    handleChange = event => {
        this.setState({ agreementIdValue: event.target.value })
    }

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            this.createAgreement(e.target.value)
        }
    }

    createAgreement = agreementId => {
        const { drizzle, drizzleState } = this.props
        const agreementStoreManager = drizzle.contracts.AgreementStoreManager

        // let drizzle know we want to call the `set` method with `value`
        const stackId = agreementStoreManager.methods['createAgreement'].cacheSend(
            agreementId,
            agreementId,
            [drizzleState.accounts[0]],
            [agreementId],
            [0],
            [0],
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
    }

    render() {
        const { AgreementStoreManager } = this.props.drizzleState.contracts
        const agreementListSize = AgreementStoreManager.getAgreementListSize[this.state.getAgreementListSizeKey]
        const agreementIds = AgreementStoreManager.getAgreementIds[this.state.getAgreementIdsKey]

        return (
            <div className={styles.wrapper}>
                <div className={styles.itemForm}>
                    <Input
                        label="Agreement"
                        name="agreement"
                        type="text"
                        value={this.state.agreementIdValue}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown} />
                    <div>{this.getTxStatus()}</div>
                </div>
                <p>AgreementList Size: {agreementListSize && agreementListSize.value}</p>
                {
                    agreementIds && agreementIds.value && agreementIds.value.map(agreementId => (
                        <AgreementItem
                            key={agreementId}
                            agreementId={agreementId}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    ))
                }
            </div>
        )
    }
}

export default AgreementList
