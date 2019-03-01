import React from 'react'
import AgreementItem from './AgreementItem'
import styles from './Agreement.module.scss'
import DrizzleComponent from '../../components/molecules/DrizzleComponent'
import OceanContext from '../../context/Ocean'

class AgreementList extends DrizzleComponent {
    state = {
        stackId: null,
        getAgreementIdsKey: null,
        getAgreementListSizeKey: null
    }

    componentDidMount() {
        this.getAgreements()
    }

    getAgreements = () => {
        const { drizzle } = this.props
        const agreementStoreManager = drizzle.contracts.AgreementStoreManager

        const getAgreementListSizeKey = agreementStoreManager.methods['getAgreementListSize'].cacheCall()
        const getAgreementIdsKey = agreementStoreManager.methods['getAgreementIds'].cacheCall()

        this.setState({
            getAgreementListSizeKey,
            getAgreementIdsKey
        })
    }

    render() {
        const { AgreementStoreManager } = this.props.drizzleState.contracts
        const agreementListSize = AgreementStoreManager.getAgreementListSize[this.state.getAgreementListSizeKey]
        this.context.agreement.amount = agreementListSize && agreementListSize.value
        const agreementIds = AgreementStoreManager.getAgreementIds[this.state.getAgreementIdsKey]

        return (
            <div className={styles.wrapper}>
                {
                    agreementIds && agreementIds.value && agreementIds.value.map(agreementId => (
                        <AgreementItem
                            key={agreementId}
                            agreementId={agreementId}
                            drizzle={this.props.drizzle}
                            drizzleState={this.props.drizzleState}
                        />
                    ))
                }
            </div>
        )
    }
}

AgreementList.contextType = OceanContext

export default AgreementList
