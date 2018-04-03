import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import socketIOClient from "socket.io-client";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }

    //bindings go here

  }

  //functions go here
  componentWillMount() {
    // console.log("In Messages.jsx, this.props.messages is", this.props.messages);
    // console.log("In Messages.jsx, this.props.triggerChatAlert", this.props.triggerChatAlert);
    // console.log("In Messages.jsx, this.props.user", this.props.user);
    // this.props.socket.emit("receiveAllChatMessages", this.props.user.username);
    // this.props.socket.on("receiveAllChatMessages", (messages) => {
    //   this.setState({messages: messages});
    // })
    if (this.props.triggerChatAlert === true) {
      console.log("in Messages.jsx, triggerChatAlert is true and now setting to false");
      this.props.setMessagesFalse();
    }
  }
  
  componentDidMount() {
    // console.log("In Messages.jsx, this.props.user", this.props.user);
    // this.props.socket.on("receiveAllChatMessages", (obj) => {
      //   console.log("Messages.jsx heard these messages from the backend", obj.messages)
      //   this.setState({messages: obj.messages});
      // })
      setTimeout(function(){this.props.socket.emit("receiveAllChatMessages", this.props.user.username)}.bind(this), 2000);
  }

  componentWillUnmount() {
    // console.log("Messages.jsx is unmounting");
  }





  render() {
    return (
      <div>
      {this.props.messages.map(el => <div>{el.from}: {el.message}</div>)}
      </div>
    )
  }
}

export default Messages;