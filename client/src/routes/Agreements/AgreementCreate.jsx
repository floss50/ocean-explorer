import React from 'react'
import Input from '../../components/atoms/Form/Input'
import Button from '../../components/atoms/Button'
import styles from './Agreement.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'

class AgreementCreate extends DrizzleComponent {
    state = {
        stackId: null,
        conditionIdKey: null,
        agreement: {
            agreementId: this.randomBytes32(),
            did: this.context.did.active,
            conditionTypes: [
                this.props.drizzle.contracts.HashLockCondition.address
            ],
            conditionIds: [],
            timeLocks: [0],
            timeOuts: [0]
        }
    }

    componentDidMount() {
        const { drizzle } = this.props
        const { agreementId } = this.state.agreement
        const { HashLockCondition } = drizzle.contracts

        const conditionIdKey = HashLockCondition.methods['generateId'].cacheCall(
            agreementId,
            this.hash(this.hash('420'))
        )
        this.setState({ conditionIdKey })
    }

    handleChange = event => {
        const agreement = { ...this.state.agreement }
        agreement.agreementId = event.target.value
        this.setState({ agreement })
    }

    createAgreement = () => {
        const { drizzle, drizzleState } = this.props
        const {
            agreementId,
            did,
            conditionTypes,
            timeLocks,
            timeOuts
        } = this.state.agreement
        const { AgreementStoreManager } = drizzle.contracts

        const conditionIdHash = this.props.drizzleState.contracts.HashLockCondition
            .generateId[this.state.conditionIdKey].value
        const conditionIds = [
            conditionIdHash
        ]

        const stackId = AgreementStoreManager.methods['createAgreement'].cacheSend(
            agreementId,
            did,
            conditionTypes,
            conditionIds,
            timeLocks,
            timeOuts,
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
    }

    render() {
        const {
            agreementId,
            did,
            conditionTypes,
            conditionIds,
            timeLocks,
            timeOuts
        } = this.state.agreement
        return (
            <div>
                <div className={styles.itemForm}>
                    <Input
                        label="ID"
                        name="agreementId"
                        type="text"
                        value={agreementId}
                        onChange={this.handleChange} />
                    <pre>DID: {did}</pre>
                    <pre>Condition Types: [{
                        conditionTypes
                            .map(type => this.mapAddress(type))
                            .join(', ')
                    }]
                    </pre>
                    <pre>Condition IDs: [{conditionIds.join(', ')}]</pre>
                    <pre>Time Locks: [{timeLocks.join(', ')}]</pre>
                    <pre>Time Outs: [{timeOuts.join(', ')}]</pre>
                    <br />
                    <Button onClick={this.createAgreement}>
                        + create agreement
                    </Button>
                    <div className={styles.txStatus}>{this.getTxStatus()}</div>
                </div>
            </div>
        )
    }
}

export default AgreementCreate
