import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import socketIOClient from "socket.io-client";

class Users extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    }

    //function bindings here
    this.getOnlineUsers = this.getOnlineUsers.bind(this);
    this.sendMessageToUser = this.sendMessageToUser.bind(this);
    this.chatMessageChange = this.chatMessageChange.bind(this);
  }

  //functions here
  componentWillMount() {
    this.props.socket.on("returnOnlineUsers", (usersArr) => {
      // console.log("In Users.jsx, usersArr returned from backend is", usersArr);
      this.setState({users: usersArr});
    })
    this.getOnlineUsers;
    setInterval(this.getOnlineUsers, 4000);
    // console.log(this.props.users);
  }

  getOnlineUsers() {
    this.props.socket.emit("getOnlineUsers");
  }

  sendMessageToUser(id) {
    this.props.socket.emit("sendChatMessage", {message: this.state.chatMessage, meantFor: id, from:this.props.user.username});
  }

  chatMessageChange(e) {
    this.setState({chatMessage: e.target.value});
  }


  render() {
    const users = this.state.users;
    return (
      <div>
      {users.map(el => <div>User: {el[0]}, SocketID: {el[1]} <input onChange={this.chatMessageChange} placeholder="Message this user"></input> <button onClick={() => this.sendMessageToUser(el[1])}></button></div>)}
      
      </div>
    )

    
  }

}

export default Users;