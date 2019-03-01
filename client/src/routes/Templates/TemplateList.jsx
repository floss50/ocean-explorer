import React from 'react'
import TemplateItem from './TemplateItem'
import styles from './Template.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import OceanContext from '../../context/Ocean'

class TemplateList extends DrizzleComponent {
    state = {
        getTemplateIdsKey: null,
        getTemplateListSizeKey: null
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

    render() {
        const { TemplateStoreManager } = this.props.drizzleState.contracts
        const templateListSize = TemplateStoreManager.getTemplateListSize[this.state.getTemplateListSizeKey]
        this.context.template.amount = templateListSize && templateListSize.value
        const templateIds = TemplateStoreManager.getTemplateIds[this.state.getTemplateIdsKey]
        return (
            <div className={styles.wrapper}>
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

TemplateList.contextType = OceanContext

export default TemplateList
