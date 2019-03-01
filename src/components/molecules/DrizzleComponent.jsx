import React from 'react'
import OceanContext from '../../context/Ocean'

class DrizzleComponent extends React.Component {
    randomBytes32 = () => this.props.drizzle.web3.utils.sha3(Math.random().toString())
    hash = value => this.props.drizzle.web3.utils.sha3(value)

    mapAddress = (address) => {
        return this.context.addressBook[address] ? this.context.addressBook[address] : address
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
}

DrizzleComponent.contextType = OceanContext

export default DrizzleComponent
