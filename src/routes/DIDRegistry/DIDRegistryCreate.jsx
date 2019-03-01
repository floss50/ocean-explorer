import React from 'react'
import Input from '../../components/atoms/Form/Input'
import Button from '../../components/atoms/Button'
import styles from './DIDRegistry.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import OceanContext from '../../context/Ocean'

class DIDRegistryCreate extends DrizzleComponent {
    state = {
        stackId: null,
        didValue: this.randomBytes32()
    }

    handleChange = event => {
        this.setState({ didValue: event.target.value })
    }

    registerAttribute = () => {
        const { drizzle, drizzleState } = this.props
        const { didValue } = this.state
        const contract = drizzle.contracts.DIDRegistry

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods['registerAttribute'].cacheSend(
            didValue,
            this.randomBytes32(),
            'some value',
            { from: drizzleState.accounts[0] }
        )
        this.state.didValue = this.randomBytes32()
        this.setState({
            stackId
        })
    }

    render() {
        return (
            <div className={styles.itemForm}>
                <Input
                    label="DID"
                    name="did"
                    type="text"
                    value={this.state.didValue}
                    onChange={this.handleChange}
                    onKeyDown={this.handleKeyDown} />
                <Button onClick={this.registerAttribute}>
                    Register DID
                </Button>
                <div>{this.getTxStatus()}</div>
            </div>
        )
    }
}

DIDRegistryCreate.contextType = OceanContext

export default DIDRegistryCreate
