import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import socketIOClient from "socket.io-client";

class ChatAlert extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    //bindings go here


  }

  //functions go here


  render() {
    return (
      <div>
      {/* You have new chat messages. */}
      </div>
    )
  }


}

export default ChatAlert;