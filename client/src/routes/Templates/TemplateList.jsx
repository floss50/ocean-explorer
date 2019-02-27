import React from 'react'
import Input from '../../components/atoms/Form/Input'
import TemplateItem from './TemplateItem'
import styles from './Template.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'

class TemplateList extends DrizzleComponent {
    state = {
        stackId: null,
        getTemplateIdsKey: null,
        getTemplateListSizeKey: null,
        templateIdValue: this.props.drizzleState.accounts[0]
    }

    componentDidMount() {
        this.getTemplates()
    }

    getTemplates = () => {
        const { drizzle } = this.props
        const templateStoreManager = drizzle.contracts.TemplateStoreManager

        const getTemplateListSizeKey = templateStoreManager.methods['getTemplateListSize'].cacheCall()
        const getTemplateIdsKey = templateStoreManager.methods['getTemplateIds'].cacheCall()

        this.setState({
            getTemplateIdsKey,
            getTemplateListSizeKey
        })
    }

    handleChange = event => {
        this.setState({ templateIdValue: event.target.value })
    }

    handleKeyDown = e => {
        if (e.keyCode === 13) {
            this.proposeTemplate(e.target.value)
        }
    }

    proposeTemplate = templateId => {
        const { drizzle, drizzleState } = this.props
        const templateStoreManager = drizzle.contracts.TemplateStoreManager
        const stackId = templateStoreManager.methods['proposeTemplate'].cacheSend(
            templateId,
            { from: drizzleState.accounts[0] }
        )
        this.setState({
            stackId
        })
    }

    render() {
        const { TemplateStoreManager } = this.props.drizzleState.contracts
        const templateListSize = TemplateStoreManager.getTemplateListSize[this.state.getTemplateListSizeKey]
        const templateIds = TemplateStoreManager.getTemplateIds[this.state.getTemplateIdsKey]

        return (
            <div className={styles.wrapper}>
                <div className={styles.itemForm}>
                    <Input
                        label="Template"
                        name="template"
                        type="text"
                        value={this.state.templateIdValue}
                        onChange={this.handleChange}
                        onKeyDown={this.handleKeyDown} />
                    <div>{this.getTxStatus()}</div>
                </div>
                <p>TemplateList Size: {templateListSize && templateListSize.value}</p>
                {
                    templateIds && templateIds.value && templateIds.value.map(templateId => (
                        <TemplateItem
                            key={templateId}
                            templateId={templateId}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    ))
                }
            </div>
        )
    }
}

export default TemplateList
