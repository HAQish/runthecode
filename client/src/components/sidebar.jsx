import React, { Component } from 'react'
import { Sidebar, Segment, Button, Menu, Image, Icon, Header } from 'semantic-ui-react';

class SidebarProblems extends Component {
  constructor(props) {
    super(props);
    this.state = { visible: false }
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  toggleVisibility () {
    this.setState({ visible: !this.state.visible })
  }

  render() {
    const { visible } = this.state;
    return (
      <div>
        <Button onClick={this.toggleVisibility}>Toggle Visibility</Button>
        <Sidebar.Pushable as={Segment}>
          <Sidebar as={Menu} animation='overlay' width='thin' visible={visible} icon='labeled' vertical inverted>
            <Menu.Item name='level1'>
              <Icon name='chevron down' />
              Level 1
            </Menu.Item>
            <Menu.Item name='level2'>
              Level 2 <Icon name='chevron down' />
            </Menu.Item>
            <Menu.Item name='level3'>
              Level 3
              <Icon name='chevron down' />
            </Menu.Item>
          </Sidebar>
          <Sidebar.Pusher>
            <Segment basic>
              <Header as='h3'>Application Content</Header>
              <Image src='images/monitor' />
            </Segment>
          </Sidebar.Pusher>
        </Sidebar.Pushable>
      </div>
    )
  }
}

export default SidebarProblems;