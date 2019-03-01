import React from 'react'
import Input from '../../components/atoms/Form/Input'
import Button from '../../components/atoms/Button'
import styles from './Agreement.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import OceanContext from '../../context/Ocean'

class AgreementCreate extends DrizzleComponent {
    state = {
        hidden: true,
        stackId: null,
        conditionIdKey: null,
        agreement: {
            agreementId: this.randomBytes32(),
            did: this.context.did.active
        }
    }

    componentDidMount() {
        const { drizzle } = this.props
        const { agreementId } = this.state.agreement
        const { HashLockCondition } = drizzle.contracts

        const conditionIdKey = HashLockCondition.methods['generateId'].cacheCall(
            agreementId,
            this.hash("420")
        )
        this.setState({ conditionIdKey })
    }

    toggleHidden = event => {
        this.setState({ hidden: !this.state.hidden })
    }

    handleChange = event => {
        const agreement = { ...this.state.agreement }
        agreement.agreementId = event.target.value
        this.setState({ agreement })
    }

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            this.createAgreement(e.target.value)
        }
    }

    createAgreement = agreementId => {
        const { drizzle, drizzleState } = this.props
        const { did } = this.state.agreement
        const {
            AgreementStoreManager,
            HashLockCondition
        } = drizzle.contracts

        const conditionId = this.props.drizzleState.contracts.HashLockCondition.generateId[this.state.conditionIdKey]

        // let drizzle know we want to call the `set` method with `value`
        const stackId = AgreementStoreManager.methods['createAgreement'].cacheSend(
            agreementId,
            did,
            [HashLockCondition.address],
            [conditionId.value],
            [0],
            [0],
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
    }

    render() {
        return (
            <div>
                <div className={styles.itemForm}>
                    <Button onClick={this.toggleHidden}>
                        + create new agreement
                    </Button>
                </div>
                { !this.state.hidden && (
                    <div className={styles.itemForm}>
                        <Input
                            label="ID"
                            name="agreementId"
                            type="text"
                            value={this.state.agreement.agreementId}
                            onChange={this.handleChange}
                            onKeyDown={this.handleKeyDown} />
                        <div className={styles.txStatus}>{this.getTxStatus()}</div>
                    </div>
                )}
            </div>
        )
    }
}

AgreementCreate.contextType = OceanContext

export default AgreementCreate
