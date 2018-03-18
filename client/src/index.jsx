import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Challenge from './components/challenge.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';

import { Grid, Button } from 'semantic-ui-react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      masterUser: {},
      // currentUserSolutionCode: '',
      // Global state needed:
      // email
      // level
      // XP
      // Points
      // current challenge
      // global ranking
    };
    this.logout = this.logout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  logout() {
    fetch('/logout', {credentials: 'include'})
      .then(data => this.clearState())
      .catch(error => console.log('error', error));
  }

  clearState() {
    this.setState({
      isLoggedIn: false,
      user: {}
    });
  }

  handleLogin(user) {
    this.setState({
      user: user,
      isLoggedIn: true
    });
  }

  render () {
    const loggedIn = this.state.isLoggedIn ? (
      <Challenge log={this.state.isLoggedIn} />
    ) : (
      <Home />
    )

    return (
      <div>
        <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.isLoggedIn} />
        {loggedIn}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));









































