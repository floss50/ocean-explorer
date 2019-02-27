import React from 'react'
import ConditionItem from './ConditionItem'
import styles from './Condition.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'

class ConditionList extends DrizzleComponent {
    state = {
        stackId: null,
        getConditionIdsKey: null,
        getConditionListSizeKey: null,
    }

    componentDidMount() {
        this.getConditions()
    }

    getConditions = () => {
        const { drizzle } = this.props
        const contract = drizzle.contracts.ConditionStoreManager

        const getConditionListSizeKey = contract.methods['getConditionListSize'].cacheCall()
        const getConditionIdsKey = contract.methods['getConditionIds'].cacheCall()

        this.setState({
            getConditionListSizeKey,
            getConditionIdsKey
        })
    }

    render() {
        const { ConditionStoreManager } = this.props.drizzleState.contracts
        const conditionListSize = ConditionStoreManager.getConditionListSize[this.state.getConditionListSizeKey]
        const conditionIds = ConditionStoreManager.getConditionIds[this.state.getConditionIdsKey]

        return (
            <div className={styles.wrapper}>
                <p>ConditionList Size: {conditionListSize && conditionListSize.value}</p>
                {
                    conditionIds && conditionIds.value && conditionIds.value.map(conditionId => (
                        <ConditionItem
                            key={conditionId}
                            conditionId={conditionId}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    ))
                }
            </div>
        )
    }
}

export default ConditionList
