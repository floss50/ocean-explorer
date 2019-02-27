import React, { Component } from 'react'
import DIDRegistryList from './DIDRegistry/DIDRegistryList.jsx'
import './App.css'

class DrizzleApp extends Component {
    render() {
        // if (this.state.loading) return 'Loading Drizzle...'
        return (
            <div className="App">
                <DIDRegistryList
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                />
            </div>
        )
    }
}

export default DrizzleApp
