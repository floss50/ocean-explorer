import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.jsx'
import { register } from './serviceWorker'

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from 'drizzle'
import { DrizzleContext } from 'drizzle-react'
import AgreementStoreManager from './contracts/AgreementStoreManager.json'
import ConditionStoreManager from './contracts/ConditionStoreManager.json'
import TemplateStoreManager from './contracts/TemplateStoreManager.json'
import DIDRegistry from './contracts/DIDRegistry.json'
import HashLockCondition from './contracts/HashLockCondition.json'
import SignCondition from './contracts/SignCondition.json'
import AccessSecretStoreCondition from './contracts/AccessSecretStoreCondition.json'
import LockRewardCondition from './contracts/LockRewardCondition.json'
import EscrowReward from './contracts/EscrowReward.json'

// let drizzle know what contracts we want
const options = {
    contracts: [
        DIDRegistry,
        AgreementStoreManager,
        ConditionStoreManager,
        TemplateStoreManager,
        HashLockCondition,
        SignCondition,
        AccessSecretStoreCondition,
        LockRewardCondition,
        EscrowReward
    ]
}

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options)
const drizzle = new Drizzle(options, drizzleStore)

// pass in the drizzle instance
ReactDOM.render(
    <DrizzleContext.Provider drizzle={drizzle}>
        <App />
    </DrizzleContext.Provider>,
    document.getElementById('root'))
register()
