import React, { Component } from 'react'
import { DrizzleContext } from 'drizzle-react'
import Route from '../components/templates/Route'
import OceanContext from '../context/Ocean'
import TemplateList from './Templates/TemplateList.jsx'
import TemplatePropose from './Templates/TemplatePropose'
import meta from '../data/meta.json'
import '../App.css'
import styles from '../App.module.scss'

class Templates extends Component {
    render() {
        return (
            <DrizzleContext.Consumer>
                {drizzleContext => {
                    const { drizzle, drizzleState } = drizzleContext
                    return (
                        <Route
                            title={`${meta.templates.title} (${this.context.template.amount})`}
                            className={styles.home}
                        >
                            <TemplatePropose
                                drizzle={drizzle}
                                drizzleState={drizzleState}
                            />
                            <TemplateList
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

Templates.contextType = OceanContext

export default Templates
