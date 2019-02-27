import React, { Component } from 'react'
import Button from '../../components/atoms/Button'

class TemplateItem extends Component {
    state = {
        stackId: null,
        getTemplateKey: null
    }

    componentDidMount() {
        this.getTemplate()
    }

    getTemplate = () => {
        const { templateId, drizzle } = this.props
        if (!templateId) { return null }
        const templateStoreManager = drizzle.contracts.TemplateStoreManager

        const getTemplateKey = templateStoreManager.methods['getTemplate'].cacheCall(templateId)
        this.setState({
            getTemplateKey
        })
    }

    approveTemplate = () => {
        const { templateId, drizzle, drizzleState } = this.props
        const templateStoreManager = drizzle.contracts.TemplateStoreManager
        const stackId = templateStoreManager.methods['approveTemplate'].cacheSend(
            templateId,
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
    }

    render() {
        const { TemplateStoreManager } = this.props.drizzleState.contracts
        const template = TemplateStoreManager.getTemplate[this.state.getTemplateKey]

        return (
            <div>
                <div>{this.props.templateId}</div>
                <div>State: {template && template.value.state}</div>
                <Button onClick={this.approveTemplate}>Approve</Button>
            </div>
        )
    }
}

export default TemplateItem
