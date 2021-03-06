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
  }

  componentWillMount() {
    console.log("In navbar.jsx, socket is", this.props.socket);
    console.log("In navbar.jsx, user is", this.props.user, this.props.isLoggedIn);
  }

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
    this.setState({activeItem: 'home', openSignupModal: false});
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
            <Header icon='signup' content='Signup' />
            <Modal.Content>
              <Modal.Description>
                <Header inverted>Get Ready for a coding experience like no other</Header>
                  <Button color="grey" onClick={this.closeSignupModal} className="signupClose" style={{ position: "absolute", top: "16px" }}>
                    X
                  </Button>
                <Signup handleLogin={this.handleLoginSubmit} />
              </Modal.Description>
            </Modal.Content>
            
          </Modal>
        </Menu.Menu>
      );
    } else {
      options = <Menu.Menu position='right'>
          <Menu.Item as={Link} to="/" position="right" name="Dashboard" icon="dashboard" active={activeItem === "Dashboard"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/messages" position="right" name="Messages" content={newMessages} icon="mail outline" active={activeItem === "Messages"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/users" position="right" name="Users" icon="users" active={activeItem === "Users"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/course" position="right" name="Course" active={activeItem === "Course"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/allchallenges" position="right" name="Challenges" active={activeItem === "Challenges"} onClick={this.handleItemClick} />
          <Menu.Item as={Link} to="/" position="right" name="logout" active={activeItem === "logout"} onClick={this.handleLogoutClick} />
        </Menu.Menu>;
    }

    return <div style={{ marginBottom: "0px"}} className="navbarheaderthing">
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item as={Link} to="/">
              <Header style={{ textAlign: "center", color: "white" }}>
              <Icon name="code" size="tiny" className="LUCIcon"/>
                LevelUP Code
              </Header>
            </Menu.Item>
            {options}
          </Menu>
        </Segment>
      </div>;
  }
}

export default Navbar;