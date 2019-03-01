import React from 'react'
import classnames from 'classnames'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import Button from '../../components/atoms/Button'
import styles from './Template.module.scss'

class TemplateItem extends DrizzleComponent {
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

    revokeTemplate = () => {
        const { templateId, drizzle, drizzleState } = this.props
        const templateStoreManager = drizzle.contracts.TemplateStoreManager
        const stackId = templateStoreManager.methods['revokeTemplate'].cacheSend(
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

        if (template) {
            const {
                owner,
                state,
                lastUpdatedBy,
                blockNumberUpdated
            } = template.value

            let classNameTemplate
            switch (state) {
                case '1':
                    classNameTemplate = styles.cardProposed
                    break
                case '2':
                    classNameTemplate = styles.cardApproved
                    break
                case '3':
                    classNameTemplate = styles.cardRevoked
                    break
                default:
                    classNameTemplate = null
            }

            return (
                <div className={classnames(styles.card, styles.templateContainer, classNameTemplate)}>
                    <pre>ID: {this.props.templateId}</pre>
                    <pre>State: {state}</pre>
                    <pre>Template Owner: {this.mapAddress(owner)}</pre>
                    <pre>Updated: {blockNumberUpdated} by {this.mapAddress(lastUpdatedBy)}</pre>
                    {
                        state === '1' &&
                        <Button onClick={this.approveTemplate}>Approve</Button>
                    }
                    {
                        state === '2' &&
                        <Button onClick={this.revokeTemplate}>Revoke</Button>
                    }
                    <div className={styles.txStatus}>{this.getTxStatus()}</div>
                </div>
            )
        }
        return null
    }
}

export default TemplateItem
