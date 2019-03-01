import React from 'react'
import DIDRegistryItem from './DIDRegistryItem'
import styles from './DIDRegistry.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import OceanContext from '../../context/Ocean'

class DIDRegistryList extends DrizzleComponent {
    state = {
        stackId: null,
        getDIDRegisterIdsKey: null,
        getDIDRegistrySizeKey: null,
        getAgreementIdsForDIDKey: null
    }

    componentDidMount() {
        this.getDIDs()
    }

    getDIDs = () => {
        const { drizzle } = this.props
        const contract = drizzle.contracts.DIDRegistry

        const getDIDRegisterIdsKey = contract.methods['getDIDRegisterIds'].cacheCall()
        const getDIDRegistrySizeKey = contract.methods['getDIDRegistrySize'].cacheCall()

        this.setState({
            getDIDRegisterIdsKey,
            getDIDRegistrySizeKey
        })
    }

    handleClick = did => {
        this.context.did.active = did
    }

    render() {
        const { DIDRegistry } = this.props.drizzleState.contracts
        const didRegisterIds = DIDRegistry.getDIDRegisterIds[this.state.getDIDRegisterIdsKey]
        const didRegistrySize = DIDRegistry.getDIDRegistrySize[this.state.getDIDRegistrySizeKey]
        this.context.did.amount = didRegistrySize && didRegistrySize.value

        return (
            <div className={styles.wrapper}>
                {
                    didRegisterIds && didRegisterIds.value && didRegisterIds.value.map(did => (
                        <DIDRegistryItem
                            key={did}
                            did={did}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                            onClick={() => this.handleClick(did)}
                        />
                    ))
                }
            </div>
        )
    }
}

DIDRegistryList.contextType = OceanContext

export default DIDRegistryList
