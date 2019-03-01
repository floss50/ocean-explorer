import React from 'react'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import Button from '../../components/atoms/Button'
import Input from '../../components/atoms/Form/Input'
import styles from './Condition.module.scss'

class HashLockConditionItem extends DrizzleComponent {
    state = {
        stackId: null,
        secret: 420
    }

    handleChange = event => {
        this.setState({ secret: event.target.value })
    }

    fulfillCondition = () => {
        const { drizzle } = this.props
        const { HashLockCondition } = drizzle.contracts

        // let drizzle know we want to call the `set` method with `value`
        const stackId = HashLockCondition.methods['fulfill'].cacheSend(
            this.props.agreementId,
            this.state.secret
        )
        this.setState({
            stackId
        })
    }

    render() {
        return (
            <div>
                <div className={styles.itemForm}>
                    <Input
                        label="Secret"
                        name="secret"
                        type="text"
                        value={this.state.secret}
                        onChange={this.handleChange} />
                    <div className={styles.txStatus}>{this.getTxStatus()}</div>
                </div>
                <div className={styles.itemForm}>
                    <Button onClick={this.fulfillCondition}>
                        Fulfill
                    </Button>
                </div>
            </div>
        )
    }
}

export default HashLockConditionItem
