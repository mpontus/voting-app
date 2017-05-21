import React from 'react'
import { Switch, Route } from 'react-router-dom';
import HomePage from 'containers/HomePage';
import PollForm from 'containers/PollForm';
import PollRoute from 'containers/PollRoute';

const App = () => (
    <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/new" component={PollForm} />
        <Route path="/poll/:id" component={PollRoute} />
    </Switch>
)

export default App;
