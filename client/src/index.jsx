import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Challenge from './components/challenge.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import { Sidebar, Button, Menu, Image, Icon, Header, Grid, Segment } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false, //false?render <Home>...true?render logout button and <Challenge>...set to true on login/signup
      masterUser: {}, //{"local":{"email":"fakeemail@yahoo.com","password":"fakepw"},"completedInitial":false,"completedChallenges":[],"_id":"5ab5358921b7e547a81fcc3e","createdAt":"2018-03-23T17:12:41.095Z","username":"fakeusername","__v":0}
      visible: false
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
    const {visible} = this.state;
    const loggedIn = this.state.isLoggedIn ? (
      <Challenge initialComplete={this.handleInitialComplete} user={this.state.masterUser}/>
    ) : (
      <Home />
    )

    return (
      <div>
        <div>
          <Sidebar.Pushable as={Segment}>
            <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted>
              <Menu.Item name='level1'>
                Level 1
                <Icon name='chevron down' />
              </Menu.Item>
              <Menu.Item name='level2'>
                Level 2
                <Icon name='chevron down' />
              </Menu.Item>
              <Menu.Item name='level3'>
                Level 3
                <Icon name='chevron down' />
              </Menu.Item>
            </Sidebar>
            <Sidebar.Pusher>
              <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.isLoggedIn} toggleSidebar={this.toggleVisibility} />
              {loggedIn}
            </Sidebar.Pusher>
          </Sidebar.Pushable>
          <Button onClick={this.toggleVisibility}>Toggle Visibility</Button>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));







































