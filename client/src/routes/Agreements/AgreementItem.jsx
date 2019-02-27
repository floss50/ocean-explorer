import React, { Component } from 'react'

class AgreementItem extends Component {
    state = {
        stackId: null,
        getAgreementKey: null
    }

    componentDidMount() {
        this.getAgreement()
    }

    getAgreement = () => {
        const { agreementId, drizzle } = this.props
        if (!agreementId) { return null }
        const agreementStoreManager = drizzle.contracts.AgreementStoreManager

        const getAgreementKey = agreementStoreManager.methods['getAgreement']
            .cacheCall(agreementId)

        this.setState({
            getAgreementKey
        })
    }

    render() {
        // get the contract state from drizzleState
        const { AgreementStoreManager } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        const agreement = AgreementStoreManager.getAgreement[this.state.getAgreementKey]

        return (
            <div>
                <div>{this.props.agreementId}</div>
                <div>did: {agreement && agreement.value.did}</div>
                <div>didOwner: {agreement && agreement.value.didOwner}</div>
                <div>templateId: {agreement && agreement.value.templateId}</div>
                <div>conditionIds: {agreement && agreement.value.conditionIds}</div>
            </div>
        )
    }
}

export default AgreementItem
