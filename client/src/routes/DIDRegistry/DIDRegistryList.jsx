import React, { Component } from 'react'
import Input from '../../components/atoms/Form/Input'
import DIDRegistryItem from './DIDRegistryItem'
import styles from './DIDRegistry.module.scss'

class DIDRegistryList extends Component {
    state = {
        stackId: null,
        getDIDRegisterIdsKey: null,
        getDIDRegistrySizeKey: null,
        value: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }

    componentDidMount() {
        this.getDIDs()
    }

    getDIDs = () => {
        const { drizzle } = this.props
        const contract = drizzle.contracts.DIDRegistry

        const getDIDRegisterIdsKey = contract.methods['getDIDRegisterIds'].cacheCall()
        const getDIDRegistrySizeKey = contract.methods['getDIDRegistrySize'].cacheCall()

        // let drizzle know we want to watch the `myString` method

        // save the `dataKey` to local component state for later reference
        this.setState({
            getDIDRegisterIdsKey,
            getDIDRegistrySizeKey
        })
    }

    handleChange = event => {
        this.setState({ value: event.target.value })
    }

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
        if (e.keyCode === 13) {
            this.registerAttribute(e.target.value)
        }
    }

    registerAttribute = value => {
        const { drizzle, drizzleState } = this.props
        const contract = drizzle.contracts.DIDRegistry

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods['registerAttribute'].cacheSend(
            this.state.value,
            '0x0000000000000000000000000000000000000000000000000000000000000003',
            'some value',
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
        this.getDIDs()
    }

    getTxStatus = () => {
        // get the transaction states from the drizzle state
        const { transactions, transactionStack } = this.props.drizzleState

        // get the transaction hash using our saved `stackId`
        const txHash = transactionStack[this.state.stackId]

        // if transaction hash does not exist, don't display anything
        if (!txHash || !transactions[txHash]) return null

        // otherwise, return the transaction status
        return `Transaction status: ${transactions[txHash].status}`
    }

    render() {
        // get the contract state from drizzleState
        const { DIDRegistry } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        const didRegisterIds = DIDRegistry.getDIDRegisterIds[this.state.getDIDRegisterIdsKey]
        const didRegistrySize = DIDRegistry.getDIDRegistrySize[this.state.getDIDRegistrySizeKey]

        return (
            <div className={styles.wrapper}>
                <div className={styles.itemForm}>
                    <Input
                        label="DID"
                        name="did"
                        type="text"
                        value={this.state.value}
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
