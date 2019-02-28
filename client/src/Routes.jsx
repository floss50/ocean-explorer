import React from 'react'
import { Route, Switch } from 'react-router-dom'

import Home from './routes/Home'
import Agreements from './routes/Agreements'
import Conditions from './routes/Conditions'
import Templates from './routes/Templates'
import DIDRegistry from './routes/DIDRegistry'
import NotFound from './routes/NotFound'

const Routes = () => (
    <Switch>
        <Route exact component={Home} path="/" />
        <Route exact component={DIDRegistry} path="/dids" />
        <Route exact component={Agreements} path="/agreements" />
        <Route exact component={Conditions} path="/conditions" />
        <Route exact component={Templates} path="/templates" />
        <Route component={NotFound} />
    </Switch>
)

export default Routes
