import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import { Grid, Button } from 'semantic-ui-react';
import socketIOClient from "socket.io-client";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      interval: null
    };

    //bindings go here

  }

  //functions go here
  componentWillMount() {
    if (this.props.triggerChatAlert === true) {
      console.log("in Messages.jsx, triggerChatAlert is true and now setting to false");
      this.props.setMessagesFalse();
    }
  }
  
  componentDidMount() {
    let interval = setInterval(function() {  
      if (this.props.user) this.props.socket.emit("receiveAllChatMessages", this.props.user.username);
    }.bind(this), 1000);
    this.setState({ interval: interval });
  }

  componentWillUnmount() {
    clearInterval(this.state.interval);
    // console.log("Messages.jsx is unmounting");
  }





  render() {
    return (
      <Grid className="messagesGrid">
        {this.props.messages.map((el, i) => <Grid.Row className="messages" key={i}>
        <Grid.Column width={2} className="messageFrom">{el.from}:</Grid.Column> 
          <Grid.Column width={14} className="messageContent">{el.message}</Grid.Column>
        </Grid.Row>)}
      </Grid>
    )
  }
}

export default Messages;