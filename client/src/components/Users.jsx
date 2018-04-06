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
    this.getAllUsers = this.getAllUsers.bind(this);
  }

  //functions here
  componentWillMount() {
    this.props.socket.on("returnOnlineUsers", (usersArr) => {
      // console.log("In Users.jsx, usersArr returned from backend is", usersArr);
      this.setState({users: usersArr});
    })
    setInterval(this.getOnlineUsers, 1500);
    this.props.socket.on("getAllUsers", (users) => {
      this.setState({allUsers: users});
    })
    this.getAllUsers()
  }
   
  getAllUsers() {
    this.props.socket.emit("getAllUsers");
  }

  getOnlineUsers() {
    this.props.socket.emit("getOnlineUsers");
  }

  sendMessageToUser(id, to) {
    this.props.socket.emit("sendChatMessage", {message: this.state.chatMessage, meantFor: id, from:this.props.user.username, to: to});
  }

  chatMessageChange(e) {
    this.setState({chatMessage: e.target.value});
  }


  render() {
    const users = this.state.users;
    const allUsers = this.state.allUsers ? (<div>{
      this.state.allUsers.map(user => {
        return (
          <div>Username: {user.username}</div>
        )
      })
    }</div>) : (<br />);
    return (
      <div>Online Users <br />
        {users.map(el => {
          return (
            <div>
              <span>Username: {el[0]}</span>
              <input onChange={this.chatMessageChange} placeholder="Message this user" /> 
              <button onClick={() => this.sendMessageToUser(el[1], el[0])} >Send</button>
            </div>
            )
          })
        }
        <br /> <br /><br />All Users<br /><br />
        {allUsers}
      </div>
    )
  }
}

export default Users;