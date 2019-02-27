import React, { Component } from 'react'
import DIDRegistryList from './routes/DIDRegistry/DIDRegistryList.jsx'
import AgreementList from './routes/Agreements/AgreementList.jsx'
import TemplateList from './routes/Templates/TemplateList.jsx'
import './App.css'

class DrizzleApp extends Component {
    state = {
        stackId: null
    }

    render() {
        return (
            <div className="App">
                <DIDRegistryList
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                />
                <AgreementList
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                />
                <TemplateList
                    drizzle={this.props.drizzle}
                    drizzleState={this.props.drizzleState}
                />
            </div>
        )
    }
}

export default DrizzleApp
