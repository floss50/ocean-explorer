import React from 'react'
import { DrizzleContext } from 'drizzle-react'
import DrizzleApp from './DrizzleApp'
import Content from './components/atoms/Content'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Spinner from './components/atoms/Spinner'

import './styles/global.scss'
import styles from './App.module.scss'

export default () => (
    <DrizzleContext.Consumer>
        {drizzleContext => {
            const { drizzle, drizzleState, initialized } = drizzleContext
            return (
                <div className={styles.app}>

                    <Header />

                    <main className={styles.main}>
                        { !initialized ? (
                            <div className={styles.loader}>
                                <Spinner message="Connecting to Ocean..." />
                            </div>
                        ) : (
                            <div className={styles.home}>
                                <Content>
                                    <DrizzleApp
                                        drizzle={drizzle}
                                        drizzleState={drizzleState} />
                                </Content>
                            </div>
                        )}
                    </main>

                    <Footer />
                </div>
            )
        }}
    </DrizzleContext.Consumer>
)
