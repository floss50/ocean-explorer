import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import Route from '../components/templates/Route'
import ConditionList from './Conditions/ConditionList.jsx'
import meta from '../data/meta.json'
import '../App.css'
import styles from '../App.module.scss'

class Home extends Component {
    render() {
        return (
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const { drizzle, drizzleState } = drizzleContext
                    return (
                        <Route
                            title={meta.title}
                            description={meta.description}
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

export default Home
