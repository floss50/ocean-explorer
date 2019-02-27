import React, { Component } from 'react'

class AgreementItem extends Component {
    state = {
        stackId: null,
        getBlockNumberUpdatedKey: null
    }

    componentDidMount() {
        this.getAttributes()
    }

    getAttributes = () => {
        const { did, drizzle } = this.props
        if (!did) { return null }
        const contract = drizzle.contracts.DIDRegistry

        const getBlockNumberUpdatedKey = contract.methods['getBlockNumberUpdated'].cacheCall(did)
        this.setState({
            getBlockNumberUpdatedKey
        })
    }
    render() {
        // get the contract state from drizzleState
        const { DIDRegistry } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        const blockNumberUpdated = DIDRegistry.getBlockNumberUpdated[this.state.getBlockNumberUpdatedKey]

        return (
            <div>
                <div>{this.props.did} - Updated: {blockNumberUpdated && blockNumberUpdated.value}</div>
            </div>
        )
    }
}

export default AgreementItem
