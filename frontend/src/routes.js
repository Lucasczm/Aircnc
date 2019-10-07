import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import New from './pages/New';
import Register from './pages/Register';
import RequestRecover from './pages/RequestRecover';
import Recover from './pages/Recover';

import Error404 from './pages/404';

export default function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Login} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/new" component={New} />
        <Route path="/register" component={Register} />
        <Route path="/recover" exact component={RequestRecover} />
        <Route path="/recover/:token" component={Recover} />
        <Route component={Error404} />
      </Switch>
    </BrowserRouter>
  );
}
