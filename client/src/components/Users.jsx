import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import {Grid, Button, Input} from 'semantic-ui-react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: 40px auto;
  justify-content: space-around;
  width: 70vw;
  text-align: center;
`;

const Heading = styled.h3`
  text-align: center;
  padding-bottom: 20px;
  font-size: 3rem;
  color: #6f999d;
`;

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
    this.clearMessage = this.clearMessage.bind(this);
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
    this.setState({chatMessage: ""});
  }

  chatMessageChange(e) {
    this.setState({chatMessage: e.target.value});
  }

  clearMessage() {
    console.log("clearMessage, this.message.value is", this.message.value, "this.state.chasMessage is", this.state.chatMessage);
    this.setState({chatMessage: ""});
    this.message.value = "";
    console.log("after clearMessage reset, this.message.value is", this.message.value, "this.state.chasMessage is", this.state.chatMessage);
  }


  render() {
    const users = this.state.users;
    let allUsers;
    if (this.state.allUsers) {
      allUsers = <React.Fragment>{this.state.allUsers.map(user => {
        return (
          <Grid.Row className="list-view">
            <Grid.Column width={4}>
              <h3>Username:</h3>
            </Grid.Column>
            <Grid.Column width={8}>
              <h3>{user.username}</h3>
            </Grid.Column>
          </Grid.Row>
        )
      })}</React.Fragment>
    } else {
      allUsers = <span />
    }

    return <Wrapper>
        <Grid divided="vertically">
          <Grid.Row>
            <Heading>Online Users</Heading>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <h3 className="contentWhite">Username</h3>
            </Grid.Column>
            <Grid.Column width={10}>
              <h3 className="contentWhite">Message this User</h3>
            </Grid.Column>
          </Grid.Row>
          {users.map(el => <Grid.Row className="list-view">
              <Grid.Column width={6}>
                <h3>{el[0]}</h3>
              </Grid.Column>
              <Grid.Column width={8}>
                <Input onChange={this.chatMessageChange} fluid placeholder="Message this User" ref={el => this.message = el}/>
                {/* <input onChange={this.chatMessageChange} placeholder="Message this user" /> */}
              </Grid.Column>
              <Grid.Column width={2}>
                <Button primary onClick={() => {this.sendMessageToUser(el[1], el[0]);
                  this.clearMessage();}}>
                  Send
                </Button>
              </Grid.Column>
            </Grid.Row>)}
        </Grid>
        <Grid divided="vertically">
          <Grid.Row>
            <Heading>All Users</Heading>
          </Grid.Row>
          {allUsers}
        </Grid>
      </Wrapper>;
  }
}

export default Users;