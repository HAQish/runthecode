import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Header, Modal, Menu, Segment, Icon, Button } from 'semantic-ui-react';

import Login from './login.jsx';
import Signup from './signup.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeItem: 'home',
      openSignupModal: false,
      messages: []
    }
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.closeSignupModal = this.closeSignupModal.bind(this);
    this.openSignupModal = this.openSignupModal.bind(this);
    this.openSidebar = this.openSidebar.bind(this);
    // this.getOnlineUsers = this.getOnlineUsers.bind(this);
  }

  componentWillMount() {
    console.log("In navbar.jsx, socket is", this.props.socket);
    console.log("In navbar.jsx, user is", this.props.user, this.props.isLoggedIn);
    // this.props.socket.on("sendChatMessage", (message) => {
    //   console.log("In Navbar.js, heard message from socket from backend", message);
    //     this.setState({messages: this.state.messages.concat(message)});
    // })
    
  }

  // componentDidMount() {
  //   this.props.socket.on("returnOnlineUsers", function(usersArr) {
  //     console.log("In navbar, usersArr returned from backend is", usersArr);
  //   })
  //   setInterval(this.getOnlineUsers, 5000);
  // }

  // getOnlineUsers() {
  //   this.props.socket.emit("getOnlineUsers");
  // }

  handleItemClick (e, {name}) {
    this.setState({ activeItem: name });
  }

  handleLogoutClick (e) {
    this.setState({activeItem: 'home'});
    this.props.logout();
    this.props.socket.emit("Logout socket", this.props.user.username);
  }
  
  handleLoginSubmit(user) {
    this.props.handleLogin(user);
    // this.setState({activeItem: 'home', openSignupModal: false});
  }

  openSignupModal() {
    this.setState({openSignupModal: true, activeItem: 'signup'});
  }

  closeSignupModal() {
    this.setState({
      openSignupModal: false,
      activeItem: 'home'
    })
  }

  openSidebar() {
    this.props.isLoggedIn ? this.props.toggleSidebar() : this.openSignupModal();
  }

  render() {
    const { activeItem } = this.state;
    const newMessages = this.props.triggerChatAlert ? "(!)Messages" : "Messages";
    let form;
    if (this.state.activeItem === 'login') {
      form = <Login handleLogin={this.handleLoginSubmit} />;
    } else {
      form = <span></span>
    }
    let options;
    if (this.props.isLoggedIn === undefined || this.props.isLoggedIn === '') {
      options = (
        <Menu.Menu position='right'>
          {form}
          <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
          <Modal
            style={{height: '65%'}}
            basic
            dimmer
            style={{height:"80%"}}
            closeOnDimmerClick
            open={this.state.openSignupModal}
            onClose={this.closeSignupModal}
            trigger={<Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.openSignupModal} />}>
            <Header icon='signup' content='Signup Page' />
            <Modal.Content>
              <Modal.Description>
                <Header inverted>Get Ready for a coding experience like no other</Header>
                <Signup handleLogin={this.handleLoginSubmit} />
              </Modal.Description>
            </Modal.Content>
            <Modal.Actions >
              <Button color='red' onClick={this.closeSignupModal}>
                <Icon name='remove' /> Close
                </Button>
            </Modal.Actions>
          </Modal>
        </Menu.Menu>
      );
    } else {
      options = <Menu.Menu position='right'>
          <Menu.Item as={Link} to="/messages" position="right" name="Messages" content={newMessages} icon="mail outline" active={activeItem === "Messages"} onClick={this.handleItemClick} user={this.props.user} triggerChatAlert={this.props.triggerChatAlert} />
          <Menu.Item as={Link} to="/users" position="right" name="Users" icon="users" active={activeItem === "Users"} onClick={this.handleItemClick} user={this.props.user}/>
          <Menu.Item as={Link} to="/" position="right" name="Dashboard" icon="dashboard" active={activeItem === "Dashboard"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/course" position="right" name="Course" active={activeItem === "Course"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/allchallenges" position="right" name="Challenges" active={activeItem === "Challenges"} onClick={this.handleItemClick} socket={this.props.socket}/>
          <Menu.Item as={Link} to="/" position="right" name="logout" active={activeItem === "logout"} onClick={this.handleLogoutClick} />
        </Menu.Menu>;
    }

    return <div style={{ marginBottom: "0px" }}>
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item name="home" active={activeItem === "home"} onClick={this.openSidebar}>
              <Icon name="puzzle" size="big" inverted />
            </Menu.Item>
            <Menu.Item as={Link} to="/">
              <Header style={{ textAlign: "center", color: "white" }}>
                {this.props.isLoggedIn === undefined || this.props.isLoggedIn === '' ? 'LevelUP Code' : `Welcome ${this.props.isLoggedIn.username}`}
              </Header>
            </Menu.Item>
            {options}
          </Menu>
        </Segment>
      </div>;
  }
}

export default Navbar;