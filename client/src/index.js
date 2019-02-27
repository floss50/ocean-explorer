import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App.jsx'
import { register } from './serviceWorker'

// import drizzle functions and contract artifact
import { Drizzle, generateStore } from 'drizzle'
import DIDRegistry from './contracts/DIDRegistry.json'

// let drizzle know what contracts we want
const options = {
    contracts: [
        DIDRegistry
    ]
}

// setup the drizzle store and drizzle
const drizzleStore = generateStore(options)
const drizzle = new Drizzle(options, drizzleStore)

// pass in the drizzle instance
ReactDOM.render(<App drizzle={drizzle} />, document.getElementById('root'))
register()
