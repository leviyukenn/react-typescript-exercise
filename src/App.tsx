import React, { Fragment } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Login from "./pages/login";
import Admin from "./pages/admin";

function App() {
  return (
    <Fragment>
      <Switch>
        <Route path="/login" component={Login}></Route>
        <Route path="/admin" component={Admin}></Route>
        <Redirect to="/admin" />
      </Switch>
    </Fragment>
  );
}

export default App;
