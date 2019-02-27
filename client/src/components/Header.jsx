import React from 'react'
import { ReactComponent as Logo } from '@oceanprotocol/art/logo/logo.svg'
import styles from './Header.module.scss'

const Header = () => (
    <header className={styles.header}>
        <div className={styles.headerContent}>
            <Logo className={styles.headerLogoImage} />
            <h1 className={styles.headerTitle}>Test</h1>

        </div>
    </header>
)

export default Header
