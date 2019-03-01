import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import Route from '../components/templates/Route'
import OceanContext from '../context/Ocean'
import AgreementCreate from './Agreements/AgreementCreate.jsx'
import AgreementList from './Agreements/AgreementList.jsx'
import meta from '../data/meta.json'
import '../App.css'
import styles from '../App.module.scss'

class Agreements extends Component {
    render() {
        return (
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const { drizzle, drizzleState } = drizzleContext
                    return (
                        <Route
                            title={`${meta.agreements.title} (${this.context.agreement.amount})`}
                            className={styles.home}
                        >
                            <AgreementCreate
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                            />
                            <AgreementList
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

Agreements.contextType = OceanContext

export default Agreements
