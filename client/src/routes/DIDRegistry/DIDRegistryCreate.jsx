import React from 'react'
import Input from '../../components/atoms/Form/Input'
import styles from './DIDRegistry.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import OceanContext from '../../context/Ocean'

class DIDRegistryCreate extends DrizzleComponent {
    state = {
        stackId: null,
        didValue: this.props.drizzle.web3.utils.sha3(Math.random().toString())
    }

    handleChange = event => {
        this.setState({ didValue: event.target.value })
    }

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            this.registerAttribute(e.target.value)
        }
    }

    registerAttribute = did => {
        const { drizzle, drizzleState } = this.props
        const contract = drizzle.contracts.DIDRegistry

        // let drizzle know we want to call the `set` method with `value`
        const stackId = contract.methods['registerAttribute'].cacheSend(
            did,
            did,
            'some value',
            { from: drizzleState.accounts[0] }
        )
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
                <div>{this.getTxStatus()}</div>
            </div>
        )
    }
}

DIDRegistryCreate.contextType = OceanContext

export default DIDRegistryCreate
