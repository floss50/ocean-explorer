import React, { Component } from 'react'
import Input from '../../components/atoms/Form/Input'
import TemplateItem from './TemplateItem'
import styles from './Template.module.scss'

class TemplateList extends Component {
    state = {
        stackId: null,
        getTemplateIdsKey: null,
        getTemplateListSizeKey: null,
        value: '0x0000000000000000000000000000000000000000000000000000000000000001'
    }

    componentDidMount() {
        const { drizzle, drizzleState } = this.props
        const templateStoreManager = drizzle.contracts.TemplateStoreManager

        // const templateId = drizzleState.accounts[0]
        // const stackId = templateStoreManager.methods['proposeTemplate'].cacheSend(
        //     templateId,
        //     { from: drizzleState.accounts[0] }
        // )
        // this.setState({
        //     stackId
        // })
        // await templateStoreManager.approveTemplate(templateId, { from: owner })

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
        // get the contract state from drizzleState
        const { TemplateStoreManager } = this.props.drizzleState.contracts
        // using the saved `dataKey`, get the variable we're interested in
        // const didRegisterIds = TemplateStoreManager.getDIDRegisterIds[this.state.getDIDRegisterIdsKey]
        const templateListSize = TemplateStoreManager.getTemplateListSize[this.state.getTemplateListSizeKey]
        const templateIds = TemplateStoreManager.getTemplateIds[this.state.getTemplateIdsKey]

        return (
            <div className={styles.wrapper}>
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
