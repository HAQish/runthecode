import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import socketIOClient from "socket.io-client";

import Challenge from './components/challenge.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import Dashboard from './components/dashboard.jsx';
import Side from './components/side.jsx';
import AllChallenges from './components/allChallenges.jsx';
import UserChallenges from "./components/UserChallenges.jsx";
import Users from "./components/Users.jsx";
import Messages from "./components/Messages.jsx";
import NewChallengeForm from './components/NewChallengeForm.jsx';
import Footer from './components/Footer.jsx';

import { Sidebar, Button, Menu, Image, Icon, Header, Grid, Segment, Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;
const Content = styled.div`
  flex: 1;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUser: undefined,
      visible: false,
      endpoint: "/",
      messages: [],
      triggerChatAlert: false
    };
    this.logout = this.logout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.clearState = this.clearState.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.handleInitialComplete = this.handleInitialComplete.bind(this);
    this.socketInitialize = this.socketInitialize.bind(this);
    this.onlineUpdate = this.onlineUpdate.bind(this);
    this.setMessagesFalse = this.setMessagesFalse.bind(this);
  }

  componentDidMount() {
    // check if user is logged in
    // if so, set user on state
    $.get('/isLoggedIn', data => {
      console.log('🌴', data);
      if (data !== undefined) {
        this.setState({
          masterUser: data
        }, this.onlineUpdate);
      } else {
        this.setState({
          masterUser: undefined
        });
      }
    });
    console.log("In index.jsx, socket is", this.state.socket);
    this.state.socket.on("sendChatMessage", (obj) => {
      console.log("In index.jsx, heard sendChatMessage from server", obj.messages);
      this.setState({ messages: obj.messages , triggerChatAlert: true});
    });
    this.state.socket.on("receiveAllChatMessages", (obj) => {
      // console.log("Messages.jsx heard these messages from the backend", obj.messages)
      this.setState({ messages: obj.messages });
    })
  }
  
  componentWillMount() {
    this.socketInitialize();
  }

  setMessagesFalse() {
    if (this.state.triggerChatAlert) {
      this.setState({triggerChatAlert: false});
    }
  }

  onlineUpdate() {
    this.state.socket.emit("onlineUpdate", this.state.masterUser.username);
  }

  toggleVisibility() {
    this.setState({visible: !this.state.visible});
  }

  logout() {
    $.ajax({
      type: "GET",
      url: "/logout",
      success: (data) => { this.clearState(); },
      failure: (err => console.log("error in logout in app", err))
    })
  }

  clearState() {
    this.setState({
      masterUser: undefined
    });
  }

  handleLogin(user) {
    console.log('😇', user);
    return new Promise((resolve, reject) => {
      this.setState({
        masterUser: user[0],
      });
      console.log(user[0]);
      resolve(5);
    }).then(() => {setTimeout(() => {this.onlineUpdate}, 1000)});
    console.log(this.state.masterUser);
  }
  
  handleInitialComplete(score) {
    $.post("/initialChallenges", {user: this.state.masterUser, initialScore: score}, (data) => {console.log('DATA IN HANDLE INITIAL COMPLETE -> ', data); this.setState({masterUser: data})})
  }

  socketInitialize() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("connect", () => {
      console.log("Connected to socket from index.jsx, and socket id is", socket.id);
    });
    this.setState({ socket: socket });
  }

  render () {
    const {visible} = this.state;
    const loggedIn = this.state.masterUser ? 
    (<Route exact path="/" component={() => <Dashboard user={this.state.masterUser} socket={this.state.socket} onlineUpdate={this.onlineUpdate}/>} />) 
    : 
    (<Route exact path="/" component={() => <Home handleLogin={this.handleLogin} />} />);

    return <BrowserRouter>
        <Wrapper>
          <Content>
            <Side visible={this.state.visible}>
              <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.masterUser} toggleSidebar={this.toggleVisibility} socket={this.state.socket} user={this.state.masterUser}  triggerChatAlert={this.state.triggerChatAlert} setMessagesFalse={this.setMessagesFalse} />
              {loggedIn}
              <Route path="/course" component={() => <Challenge initialComplete={this.handleInitialComplete} user={this.state.masterUser} />} />
              <Route exact path="/allchallenges" component={AllChallenges} />
              <Switch>
                <Route path="/allchallenges/:challengeName" render={(props) => <UserChallenges {...props} user={this.state.masterUser} socket={this.state.socket}/>} />
              </Switch>
              <Route path="/users" component={() => <Users user={this.state.masterUser} socket={this.state.socket} />} />
              <Route path="/messages" component={() => <Messages user={this.state.masterUser} socket={this.state.socket} messages={this.state.messages} triggerChatAlert={this.state.triggerChatAlert} setMessagesFalse={this.setMessagesFalse} />} />
              <Route path="/newchallengeform" component={() => <NewChallengeForm user={this.state.masterUser} />} />
              {/* <Route path="/challenges" component={() => <UserChallenges initialComplete={this.handleInitialComplete} user={this.state.masterUser} />} /> */}
            </Side>
          </Content>
          <Footer />
        </Wrapper>
      </BrowserRouter>;
  }
}

ReactDOM.render(<App />, document.getElementById('app'));







































