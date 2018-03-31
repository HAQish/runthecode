import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import socketIOClient from "socket.io-client";

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }

    //bindings go here

  }

  //functions go here
  componentWillMount() {
    console.log("In Messages.jsx, this.props.messages is", this.props.messages);
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