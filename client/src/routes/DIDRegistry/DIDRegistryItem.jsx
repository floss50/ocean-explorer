import React, { Component } from 'react'
import AgreementItem from '../Agreements/AgreementItem'
import styles from './DIDRegistry.module.scss'
import OceanContext from '../../context/Ocean'

class DIDRegistryItem extends Component {
    state = {
        stackId: null,
        getAgreementIdsForDIDKey: null,
        getDIDRegisterKey: null,
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

        const getDIDRegisterKey = didRegistry.methods['getDIDRegister'].cacheCall(did)
        this.setState({
            getDIDRegisterKey
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
            getDIDRegisterKey,
            getAgreementIdsForDIDKey,
            hiddenAgreements
        } = this.state

        const didRegister = DIDRegistry.getDIDRegister[getDIDRegisterKey]
        const agreementIdsForDID = AgreementStoreManager.getAgreementIdsForDID[getAgreementIdsForDIDKey]

        if (didRegister) {
            const {
                owner,
                lastChecksum,
                lastUpdatedBy,
                blockNumberUpdated
            } = didRegister.value

            return (
                <div className={styles.card} onClick={this.props.onClick}>
                    <pre>ID: {this.props.did}</pre>
                    <pre>DID Owner: {this.context.addressBook[owner]}</pre>
                    <pre>Last checksum: {lastChecksum}</pre>
                    <pre>Updated: {blockNumberUpdated} by {this.context.addressBook[lastUpdatedBy]}</pre>
                    <pre
                        className={styles.collapsable}
                        onClick={this.toggleAgreements}>
                    + Agreements ({agreementIdsForDID && agreementIdsForDID.value && agreementIdsForDID.value.length})
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
        return null
    }
}

DIDRegistryItem.contextType = OceanContext

export default DIDRegistryItem
