import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Challenge from './components/challenge.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import { Sidebar, Button, Menu, Image, Icon, Header, Grid, Segment, Dropdown } from 'semantic-ui-react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      masterUser: {},
      visible: false
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
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.handleInitialComplete = this.handleInitialComplete.bind(this);
  }

  toggleVisibility() {
    this.setState({visible: !this.state.visible});
  }

  logout() {
    fetch('/logout', {credentials: 'include'})
      .then(data => this.clearState())
      .catch(error => console.log('error', error));
  }

  clearState() {
    this.setState({
      isLoggedIn: false,
      masterUser: {}
    });
  }

  handleLogin(user) {
    this.setState({
      masterUser: user[0],
      isLoggedIn: true
    });
  }
  
  handleInitialComplete(score) {
    $.post("/initialChallenges", {user: this.state.masterUser, initialScore: score}, (data) => {console.log('DATA IN HANDLE INITIAL COMPLETE -> ', data); this.setState({masterUser: data})})
  }

  render () {
    const level1Options = [
      {
        key: 1,
        text: 'Problem 1',
        value: 1
      },
      {
        key: 2,
        text: 'Problem 2',
        value: 2
      },
      {
        key: 3,
        text: 'Problem 3',
        value: 3
      }
    ];
    const {visible} = this.state;
    const loggedIn = this.state.isLoggedIn ? (
      <Challenge initialComplete={this.handleInitialComplete} user={this.state.masterUser}/>
    ) : (
        <Home handleLogin={this.handleLogin} />
    )

    return (
      <div>
        <div>
          <Sidebar.Pushable as={Segment}>
            <Sidebar as={Menu} animation='push' width='thin' visible={visible} icon='labeled' vertical inverted>
              <Dropdown icon='chevron down' fluid text='Level 1' direction='right' labeled item simple className='icon' options={level1Options} />
              <Dropdown icon='chevron down' fluid text='Level 2' direction='right' labeled item simple className='icon' options={level1Options} />
              <Dropdown icon='chevron down' fluid text='Level 3' direction='right' labeled item simple className='icon' options={level1Options} />
            </Sidebar>
            <Sidebar.Pusher>
              <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.isLoggedIn} toggleSidebar={this.toggleVisibility} />
              {loggedIn} 
            </Sidebar.Pusher>
          </Sidebar.Pushable>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));







































