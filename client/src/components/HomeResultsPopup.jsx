import React from 'react'
import { Button, Grid, Header, Popup } from 'semantic-ui-react'

const timeoutLength = 5000

class HomeResultsPopup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: this.props.open
    }
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
};


  handleOpen() {
    this.setState({ isOpen: true })
    this.props.submit();
    this.timeout = setTimeout(() => {
      this.setState({ isOpen: false })
    }, timeoutLength)
  }

  handleClose() {
    this.setState({ isOpen: false })
    clearTimeout(this.timeout)
  }

  render() {
    return (
      <Popup
        trigger={<Button content='Test your code' />}
        content={`${this.props.msg}!`}
        on='click'
        open={this.state.isOpen}
        onClose={this.handleClose}
        onOpen={this.handleOpen}
        position='top right'
      />
    )
  }
}

export default HomeResultsPopup