import React, { Component } from 'react'

class ConditionItem extends Component {
    state = {
        stackId: null,
        getConditionKey: null
    }

    componentDidMount() {
        this.getCondition()
    }

    getCondition = () => {
        const { conditionId, drizzle } = this.props
        if (!conditionId) { return null }
        const conditionStoreManager = drizzle.contracts.ConditionStoreManager

        const getConditionKey = conditionStoreManager.methods['getCondition']
            .cacheCall(conditionId)

        this.setState({
            getConditionKey
        })
    }

    render() {
        // get the contract state from drizzleState
        const { ConditionStoreManager } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        const condition = ConditionStoreManager.getCondition[this.state.getConditionKey]

        return (
            <div>
                <div>{this.props.conditionId}</div>
                <div>typeRef: {condition && condition.value.typeRef}</div>
                <div>state: {condition && condition.value.state}</div>
                <div>timeLock: {condition && condition.value.timeLock}</div>
                <div>timeOut: {condition && condition.value.timeOut}</div>
                <div>blockNumber: {condition && condition.value.blockNumber}</div>
            </div>
        )
    }
}

export default ConditionItem
