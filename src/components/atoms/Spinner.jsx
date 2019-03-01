import React from 'react'
import styles from './Spinner.module.scss'

const Spinner = ({ message }) => (
    <div className={styles.spinner}>
        {message && <div className={styles.spinnerMessage}>{message}</div>}
    </div>
)

export default Spinner
