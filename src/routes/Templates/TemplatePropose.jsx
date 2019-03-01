import React from 'react'
import Input from '../../components/atoms/Form/Input'
import styles from './Template.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import Button from '../../components/atoms/Button'

class TemplatePropose extends DrizzleComponent {
    state = {
        stackId: null,
        templateIdValue: this.props.drizzleState.accounts[0]
    }

    handleChange = event => {
        this.setState({ templateIdValue: event.target.value })
    }

    proposeTemplate = () => {
        const { drizzle, drizzleState } = this.props
        const templateStoreManager = drizzle.contracts.TemplateStoreManager
        const stackId = templateStoreManager.methods['proposeTemplate'].cacheSend(
            this.state.templateIdValue,
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
                    label="Template"
                    name="template"
                    type="text"
                    value={this.state.templateIdValue}
                    onChange={this.handleChange} />
                <Button onClick={this.proposeTemplate}>
                    Propose
                </Button>
                <div>{this.getTxStatus()}</div>
            </div>
        )
    }
}

export default TemplatePropose
