import React, { Component } from 'react'
import styles from './Agreement.module.scss'
import ConditionItem from '../Conditions/ConditionItem'

class AgreementItem extends Component {
    state = {
        stackId: null,
        getAgreementKey: null,
        hiddenConditions: true
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

    toggleConditions = e => {
        this.setState({ hiddenConditions: !this.state.hiddenConditions })
    }

    render() {
        const { AgreementStoreManager } = this.props.drizzleState.contracts
        const {
            getAgreementKey,
            hiddenConditions
        } = this.state
        const agreement = AgreementStoreManager.getAgreement[getAgreementKey]

        if (agreement) {
            return (
                <div className={styles.card}>
                    <pre>ID: {this.props.agreementId}</pre>
                    <pre>
                    DID: {agreement && agreement.value.did}
                    </pre>
                    <pre>
                    DID Owner: {agreement && agreement.value.didOwner}
                    </pre>
                    <pre>
                    Template Id: {agreement && agreement.value.templateId}
                    </pre>
                    <pre
                        className={styles.collapsable}
                        onClick={this.toggleConditions}>
                    + Conditions ({agreement && agreement.value.conditionIds && agreement.value.conditionIds.length})
                    </pre>
                    {
                        !hiddenConditions &&
                        agreement && agreement.value.conditionIds &&
                        agreement.value.conditionIds.map(conditionId => (
                            <ConditionItem
                                key={conditionId}
                                agreementId={this.props.agreementId}
                                conditionId={conditionId}
                                drizzle={this.props.drizzle}
                                drizzleState={this.props.drizzleState}
                            />
                        ))
                    }
                </div>
            )
        }
        return null
    }
}

export default AgreementItem
