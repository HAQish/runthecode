import React, { Component } from 'react';
import { Header, Modal, Menu, Segment, Icon } from 'semantic-ui-react';

import Login from './login.jsx';
import Signup from './signup.jsx';

class Navbar extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      activeItem: 'home' 
    }
    this.handleItemClick = this.handleItemClick.bind(this);
    this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  handleItemClick (e, {name}) {
    //let name = e.target.name;
    this.setState({ activeItem: name })
  }

  handleLogoutClick (e) {
    this.setState({activeItem: 'logout'});
    this.props.change();
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
          <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
          <Menu.Menu position='right'> 
            {form}
            <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick} />
            <Menu.Item name='logout' active={activeItem === 'logout'} onClick={this.handleLogoutClick} />
            <Modal basic trigger={<Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.handleItemClick} />}>
              <Header icon='signup' content='Signup Page' />
              <Modal.Content>
                <Modal.Description>
                  <Header inverted>Get Ready for a coding experience like no other</Header>
                  <Signup />
                </Modal.Description>
              </Modal.Content>
            </Modal>
          </Menu.Menu>
        </Menu>
      </Segment>
      {/* <Modal trigger={<Button>Show Modal</Button>}>
        <Modal.Header>Select a Photo</Modal.Header>
        <Modal.Content image>
          <Image wrapped size='medium' src='/assets/images/avatar/large/rachel.png' />
          <Modal.Description>
            <Header>Default Profile Image</Header>
            <p>We've found the following gravatar image associated with your e-mail address.</p>
            <p>Is it okay to use this photo?</p>
          </Modal.Description>
        </Modal.Content>
      </Modal> */}
      </div>
    )
  }
}

export default Navbar;