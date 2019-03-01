import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import Route from '../components/templates/Route'
import DIDRegistryCreate from './DIDRegistry/DIDRegistryCreate.jsx'
import DIDRegistryList from './DIDRegistry/DIDRegistryList.jsx'
import meta from '../data/meta.json'
import '../App.css'
import styles from '../App.module.scss'
import OceanContext from '../context/Ocean'

class DIDRegistry extends Component {
    render() {
        return (
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const { drizzle, drizzleState } = drizzleContext
                    const {
                        AgreementStoreManager,
                        HashLockCondition
                    } = drizzle.contracts
                    this.context.addressBook[AgreementStoreManager.address] = 'AgreementStoreManager'
                    this.context.addressBook[HashLockCondition.address] = 'HashLockCondition'
                    this.context.addressBook[drizzleState.accounts[0]] = 'accounts[0]'
                    console.log(this.context.addressBook)
                    return (
                        <Route
                            title={`${meta.did.title} (${this.context.did.amount})`}
                            className={styles.home}
                        >
                            <DIDRegistryCreate
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                            />
                            <DIDRegistryList
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                            />
                        </Route>
                    )
                }}
            </DrizzleContext.Consumer>
        )
    }
}

DIDRegistry.contextType = OceanContext

export default DIDRegistry
