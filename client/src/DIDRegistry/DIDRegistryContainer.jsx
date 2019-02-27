import React, { Component } from 'react'

class SetString extends Component {
    state = {
        stackId: null,
        dataKey: null,
        value: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }

    handleKeyDown = e => {
        // if the enter key is pressed, set the value with the string
        if (e.keyCode === 13) {
            this.setValue(e.target.value)
        }
    }

    handleChange = event => {
        this.setState({ value: event.target.value })
    }

    setValue = value => {
        const { drizzle, drizzleState } = this.props
        const contract = drizzle.contracts.DIDRegistry

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods['registerAttribute'].cacheSend(
            this.state.value,
            '0x0000000000000000000000000000000000000000000000000000000000000003',
            'some value',
            { from: drizzleState.accounts[0] }
        )

        // let drizzle know we want to watch the `myString` method
        const dataKey = contract.methods['getBlockNumberUpdated'].cacheCall(
            this.state.value
        )

        // save the `dataKey` to local component state for later reference
        this.setState({ dataKey })

        // save the `stackId` for later reference
        this.setState({ stackId })
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
        const DIDRegistrySize = DIDRegistry.getBlockNumberUpdated[this.state.dataKey]

        return (
            <div>
                <p>Block number updated: {DIDRegistrySize && DIDRegistrySize.value}</p>
                <input
                    type="text"
                    value={this.state.value}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown} />
                <div>{this.getTxStatus()}</div>
            </div>
        )
    }
}

export default SetString
