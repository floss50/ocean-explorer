import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import Route from '../components/templates/Route'

import AgreementList from './Agreements/AgreementList.jsx'
import ConditionList from './Conditions/ConditionList.jsx'
import TemplateList from './Templates/TemplateList.jsx'
import '../App.css'
import styles from '../App.module.scss'

class Home extends Component {
    render() {
        return (
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const { drizzle, drizzleState } = drizzleContext
                    return (
                        <Route className={styles.home}>

                            <TemplateList
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                            />
                            <AgreementList
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                            />
                            <ConditionList
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

export default Home
