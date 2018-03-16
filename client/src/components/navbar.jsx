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
    this.closeSignupModal = this.closeSignupModal.bind(this);
    this.openSignupModal = this.openSignupModal.bind(this);
  }

  handleItemClick (e, {name}) {
    //let name = e.target.name;
    this.setState({ activeItem: name })
  }

  handleLogoutClick (e) {
    this.setState({activeItem: 'home'});
    this.props.change();
  }

  openSignupModal() {
    this.setState({openSignupModal: true})
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
      form = <Login change={this.props.change} />;
    } else {
      form = <span></span>
    }

    return (
      <div>
      <Segment inverted>
        <Menu inverted pointing secondary>
          <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick}>
            <Icon name='puzzle' size='big' inverted />
          </Menu.Item>
          {/* <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} /> */}
          <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
          <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
          <Menu.Menu position='right'> 
            {form}
            <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleLogoutClick} />
            <Modal
            trigger={<Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.openSignupModal} />}
            basic
            dimmer
            closeOnDimmerClick
            style={{height: "65%"}}
            open={this.state.openSignupModal}
            onClose={this.closeSignupModal}>
              <Header icon='signup' content='Signup Page' />
              <Modal.Content>
                <Modal.Description>
                  <Header inverted>Get Ready for a coding experience like no other</Header>
                  <Signup />
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions >
                <Button color='red' onClick={this.closeSignupModal}>
                  <Icon name='remove' /> Close
                </Button>
              </Modal.Actions>
            </Modal>
          </Menu.Menu>
        </Menu>
      </Segment>
      </div>
    )
  }
}

export default Navbar;