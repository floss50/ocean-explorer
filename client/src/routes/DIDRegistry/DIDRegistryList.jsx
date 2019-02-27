import React from 'react'
import Input from '../../components/atoms/Form/Input'
import DIDRegistryItem from './DIDRegistryItem'
import styles from './DIDRegistry.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'

class DIDRegistryList extends DrizzleComponent {
    state = {
        stackId: null,
        getDIDRegisterIdsKey: null,
        getDIDRegistrySizeKey: null,
        didValue: '0x0000000000000000000000000000000000000000000000000000000000000001'
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

    handleChange = event => {
        this.setState({ didValue: event.target.value })
    }

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            this.registerAttribute(e.target.value)
        }
    }

    registerAttribute = did => {
        const { drizzle, drizzleState } = this.props
        const contract = drizzle.contracts.DIDRegistry

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods['registerAttribute'].cacheSend(
            did,
            did,
            'some value',
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
    }

    render() {
        const { DIDRegistry } = this.props.drizzleState.contracts
        const didRegisterIds = DIDRegistry.getDIDRegisterIds[this.state.getDIDRegisterIdsKey]
        const didRegistrySize = DIDRegistry.getDIDRegistrySize[this.state.getDIDRegistrySizeKey]

        return (
            <div className={styles.wrapper}>
                <div className={styles.itemForm}>
                    <Input
                        label="DID"
                        name="did"
                        type="text"
                        value={this.state.didValue}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown} />
                    <div>{this.getTxStatus()}</div>
                </div>
                <p>DID Registry Size: {didRegistrySize && didRegistrySize.value}</p>
                {
                    didRegisterIds && didRegisterIds.value && didRegisterIds.value.map(did => (
                        <DIDRegistryItem
                            key={did}
                            did={did}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    ))
                }
            </div>
        )
    }
}

export default DIDRegistryList
