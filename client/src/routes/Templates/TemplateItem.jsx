import React, { Component } from 'react'

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

    render() {
        // get the contract state from drizzleState
        const { TemplateStoreManager } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        const template = TemplateStoreManager.getTemplate[this.state.getTemplateKey]

        return (
            <div>
                <div>{this.props.templateId} - State: {template && template.value.state}</div>
            </div>
        )
    }
}

export default TemplateItem
