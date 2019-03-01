import React, { Component } from 'react'
import classnames from 'classnames'
import HashLockConditionItem from './HashLockConditionItem'
import styles from './Condition.module.scss'

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
        const {
            ConditionStoreManager
        } = this.props.drizzleState.contracts
        const {
            HashLockCondition
        } = this.props.drizzle.contracts

        const condition = ConditionStoreManager.getCondition[this.state.getConditionKey]
        if (condition) {
            const {
                typeRef,
                state,
                timeLock,
                timeOut,
                blockNumber,
                lastUpdatedBy,
                blockNumberUpdated
            } = condition.value

            return (
                <div className={classnames(styles.card, styles.cardUnfulfilled)}>
                    <pre>ID: {this.props.conditionId}</pre>
                    <pre>Type: {typeRef}</pre>
                    <pre>State: {state}</pre>
                    <pre>TimeLock: {timeLock} | TimeOut: {timeOut}</pre>
                    <pre>Created: {blockNumber} | Updated: {blockNumberUpdated} by {lastUpdatedBy}</pre>
                    {
                        (typeRef === HashLockCondition.address) && (
                            <HashLockConditionItem {...this.props} />
                        )
                    }
                </div>
            )
        }
        return null
    }
}

export default ConditionItem
