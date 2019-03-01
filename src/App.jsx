import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom'
import { DrizzleContext } from 'drizzle-react'
import Routes from './Routes'
import Header from './components/Header'
import Footer from './components/Footer'
import Spinner from './components/atoms/Spinner'

import './styles/global.scss'
import styles from './App.module.scss'

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const { initialized } = drizzleContext
            return (
                <div className={styles.app}>
                    <Router>
                        <>
                            <Header />

                            <main className={styles.main}>
                                { !initialized ? (
                                    <div className={styles.loader}>
                                        <Spinner message="Connecting to Ocean..." />
                                    </div>
                                ) : (
                                    <Routes />
                                )}
                            </main>

                            <Footer />
                        </>
                    </Router>
                </div>
            )
        }}
    </DrizzleContext.Consumer>
)
