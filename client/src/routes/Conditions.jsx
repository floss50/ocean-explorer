import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import Route from '../components/templates/Route'
import ConditionList from './Conditions/ConditionList.jsx'
import meta from '../data/meta.json'
import '../App.css'
import styles from '../App.module.scss'
import OceanContext from '../context/Ocean'

class Conditions extends Component {
    render() {
        return (
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const { drizzle, drizzleState } = drizzleContext
                    return (
                        <Route
                            title={`${meta.conditions.title} (${this.context.condition.amount})`}
                            className={styles.home}
                        >
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

Conditions.contextType = OceanContext

export default Conditions
