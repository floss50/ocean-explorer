import React, { Component } from 'react'
import AgreementItem from '../Agreements/AgreementItem'
import styles from './DIDRegistry.module.scss'

class DIDRegistryItem extends Component {
    state = {
        stackId: null,
        getAgreementIdsForDIDKey: null,
        getBlockNumberUpdatedKey: null,
        hiddenAgreements: true
    }

    componentDidMount() {
        this.getAttributes()
        this.getAgreementsForDID()
    }

    getAttributes = () => {
        const { did, drizzle } = this.props
        if (!did) { return null }
        const didRegistry = drizzle.contracts.DIDRegistry

        const getBlockNumberUpdatedKey = didRegistry.methods['getBlockNumberUpdated'].cacheCall(did)
        this.setState({
            getBlockNumberUpdatedKey
        })
    }

    getAgreementsForDID = () => {
        const { drizzle, did } = this.props
        const agreementStoreManager = drizzle.contracts.AgreementStoreManager

        const getAgreementIdsForDIDKey = agreementStoreManager.methods['getAgreementIdsForDID'].cacheCall(did)

        this.setState({ getAgreementIdsForDIDKey })
    }

    toggleAgreements = e => {
        this.setState({ hiddenAgreements: !this.state.hiddenAgreements })
    }

    render() {
        const { DIDRegistry, AgreementStoreManager } = this.props.drizzleState.contracts
        const {
            getBlockNumberUpdatedKey,
            getAgreementIdsForDIDKey,
            hiddenAgreements
        } = this.state

        const blockNumberUpdated = DIDRegistry.getBlockNumberUpdated[getBlockNumberUpdatedKey]
        const agreementIdsForDID = AgreementStoreManager.getAgreementIdsForDID[getAgreementIdsForDIDKey]

        return (
            <div className={styles.card} onClick={this.props.onClick}>
                <pre>ID: {this.props.did}</pre>
                <pre>Updated: {blockNumberUpdated && blockNumberUpdated.value} by </pre>
                <pre
                    className={styles.collapsable}
                    onClick={this.toggleAgreements}>
                    + Agreements ({agreementIdsForDID && agreementIdsForDID.value && agreementIdsForDID.value.length })
                </pre>
                {
                    !hiddenAgreements &&
                    agreementIdsForDID && agreementIdsForDID.value &&
                    agreementIdsForDID.value.map(agreementId => (
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

export default DIDRegistryItem
