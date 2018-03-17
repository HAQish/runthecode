import React, { Component } from 'react';
import { Header, Modal, Menu, Segment, Icon, Button } from 'semantic-ui-react';

import Login from './login.jsx';
import Signup from './signup.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeItem: 'home',
      openSignupModal: false
    }
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.closeSignupModal = this.closeSignupModal.bind(this);
    this.openSignupModal = this.openSignupModal.bind(this);
  }

  handleItemClick (e, {name}) {
    this.setState({ activeItem: name })
  }

  handleLogoutClick (e) {
    this.setState({activeItem: 'home'});
    this.props.logout();
  }
  
  handleLoginSubmit(user) {
    console.log('Inside the navbar login', user);
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

  render() {
    const { activeItem } = this.state;
    let form;
    if (this.state.activeItem === 'login') {
      form = <Login handleLogin={this.handleLoginSubmit} />;
    } else {
      form = <span></span>
    }

    let options;
    if (!this.props.isLoggedIn) {
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
            onClose={this.state.closeSignupModal}
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
      options = <Menu.Item position='right' name='logout' active={activeItem === 'logout'} onClick={this.handleLogoutClick} />;
    }

    return (
      <div>
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
            <Icon name='puzzle' size='big' inverted />
          </Menu.Item>
          <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
          <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
          {options}
        </Menu>
      </Segment>
      </div>
    )
  }
}

export default Navbar;