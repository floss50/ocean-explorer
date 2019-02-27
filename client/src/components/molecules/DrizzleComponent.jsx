import React from 'react'

class DrizzleComponent extends React.Component {
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

export default DrizzleComponent
