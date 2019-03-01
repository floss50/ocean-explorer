import React, { Component } from 'react'
import OceanContext from '../context/Ocean'
import Route from '../components/templates/Route'
import '../App.css'
import styles from '../App.module.scss'

class Home extends Component {
    render() {
        return (
            <OceanContext.Consumer>
                {oceanContext => {
                    return (
                        <Route className={styles.home} />
                    )
                }}
            </OceanContext.Consumer>
        )
    }
}

export default Home
