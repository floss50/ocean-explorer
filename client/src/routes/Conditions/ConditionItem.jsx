import React, { Component } from 'react'
import classnames from 'classnames'
import HashLockConditionItem from './HashLockConditionItem'
import styles from './Condition.module.scss'
import OceanContext from '../../context/Ocean'

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

            let classNameCondition
            switch (state) {
                case '1':
                    classNameCondition = styles.cardUnfulfilled
                    break
                case '2':
                    classNameCondition = styles.cardFulfilled
                    break
                case '3':
                    classNameCondition = styles.cardAborted
                    break
            }

            return (
                <div className={classnames(styles.card, classNameCondition)}>
                    <pre>ID: {this.props.conditionId}</pre>
                    <pre>Type: {this.context.addressBook[typeRef]}</pre>
                    <pre>State: {state}</pre>
                    <pre>TimeLock: {timeLock} | TimeOut: {timeOut}</pre>
                    <pre>Created: {blockNumber} | Updated: {blockNumberUpdated} by {this.context.addressBook[lastUpdatedBy]}</pre>
                    {
                        typeRef === HashLockCondition.address &&
                        state === '1' && (
                            <HashLockConditionItem {...this.props} />
                        )
                    }
                </div>
            )
        }
        return null
    }
}

ConditionItem.contextType = OceanContext

export default ConditionItem
