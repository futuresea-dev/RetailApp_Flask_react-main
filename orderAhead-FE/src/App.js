import React, { Component, lazy } from 'react';
import { Route, Switch, BrowserRouter } from 'react-router-dom';
import './scss/style.scss';

const Signin = lazy(() => import('./views/auth/Signin'));
const Signup = lazy(() => import('./views/auth/Signup'));

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

// Containers
const TheLayout = React.lazy(() => import('./containers/TheLayout'));


class App extends Component {

  render() {
    return (
      <BrowserRouter>
          <React.Suspense fallback={loading}>
            <Switch>
              <Route exact path="/signin" name="Login Page" render={props => <Signin {...props}/>} />
              {/* <Route exact path="/signup" name="Register Page" render={props => <Signup {...props}/>} /> */}
              <Route exact path="/signup/:code" name="Signup" render={props => <Signup {...props}/>} />
              <Route path="/" name="Home" render={props => <TheLayout {...props}/>} />
            </Switch>
          </React.Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
