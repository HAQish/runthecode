import React, { Component } from 'react';
import { Header, Modal, Menu, Segment, Icon, Button } from 'semantic-ui-react';

import Login from './login.jsx';
import Signup from './signup.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeItem: 'home',
      openModal: false
    }
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  handleItemClick (e, {name}) {
    //let name = e.target.name;
    this.setState({ activeItem: name })
  }

  handleLogoutClick (e) {
    this.setState({activeItem: 'home'});
    this.props.change();
  }

  openModal() {
    this.setState({openModal: true})
  }

  closeModal() {
    this.setState({openModal: false})
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
            <Icon name='home' size='big' inverted />
          </Menu.Item>
          {/* <Menu.Item name='home' active={activeItem === 'home'} onClick={this.handleItemClick} /> */}
          <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
          <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.openModal} />
          <Menu.Menu position='right'> 
            {form}
            <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleLogoutClick} />
            <Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.openModal} />
            <Modal basic open={this.state.openModal} onClose={this.state.closeModal}>
              <Header icon='signup' content='Signup Page' />
              <Modal.Content>
                <Modal.Description>
                  <Header inverted>Get Ready for a coding experience like no other</Header>
                  <Signup />
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions >
                <Button color='red' onClick={this.closeModal}>
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