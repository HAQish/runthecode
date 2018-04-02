import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
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
import { Sidebar, Button, Menu, Image, Icon, Header, Grid, Segment, Dropdown } from 'semantic-ui-react';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isLoggedIn: false, //false?render <Home>...true?render logout button and <Challenge>...set to true on login/signup
      masterUser: undefined, //{"local":{"email":"fakeemail@yahoo.com","password":"fakepw"},"completedInitial":false,"completedChallenges":[],"_id":"5ab5358921b7e547a81fcc3e","createdAt":"2018-03-23T17:12:41.095Z","username":"fakeusername","__v":0}
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
        });
        this.onlineUpdate();
      } else {
        this.setState({
          masterUser: undefined
        });
      }
    });
    console.log("In index.jsx, socket is", this.state.socket);
    this.state.socket.on("sendChatMessage", (message) => {
      console.log("In index.jsx, heard message from socket from backend", message);
      this.setState({ messages: this.state.messages.concat(message) , triggerChatAlert: true});
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
      // success: (data) => {this.clearState(); this.state.socket.emit("disconnect");},
      success: (data) => { this.clearState(); },
      failure: (err => console.log("error in logout in app", err))
    })
    // fetch('/logout', {credentials: 'include'})
    //   .then(data => this.clearState())
    //   .catch(error => console.log('error', error));
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
    // setTimeout(this.onlineUpdate, 300);
  }
  
  handleInitialComplete(score) {
    $.post("/initialChallenges", {user: this.state.masterUser, initialScore: score}, (data) => {console.log('DATA IN HANDLE INITIAL COMPLETE -> ', data); this.setState({masterUser: data})})
  }

  socketInitialize() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("connect", () => {
      console.log("Connected to socket from index.jsx, and socket id is", socket.id);
      // this.setState({ socketId: socket.id });
    });
    this.setState({ socket: socket });
  }

  render () {
    const {visible} = this.state;
    const loggedIn = this.state.masterUser ? 
    (<Route exact path="/" component={() => <Dashboard user={this.state.masterUser} socket={this.state.socket} onlineUpdate={this.onlineUpdate}/>} />) 
    : 
    (<Route exact path="/" component={() => <Home handleLogin={this.handleLogin} />} />);
    // const chatAlert = this.state.triggerChatAlert ? "You have new chat messages" : "";

    return(
      <BrowserRouter>
        <div>
          <div>
            <Side visible={this.state.visible}>
              <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.masterUser} toggleSidebar={this.toggleVisibility} socket={this.state.socket} user={this.state.masterUser}  triggerChatAlert={this.state.triggerChatAlert} setMessagesFalse={this.setMessagesFalse} />
              {loggedIn}
              <Route path="/course" component={() => <Challenge initialComplete={this.handleInitialComplete} user={this.state.masterUser} />} />
              <Route path="/allchallenges/:challengeName" component={AllChallenges} />
              <Route path="/challenges" component={() => <UserChallenges initialComplete={this.handleInitialComplete} user={this.state.masterUser} socket={this.state.socket}/>} />
              <Route path="/users" component={() => <Users user={this.state.masterUser} socket={this.state.socket} />} />
              <Route path="/messages" component={() => <Messages user={this.state.masterUser} socket={this.state.socket} messages={this.state.messages} triggerChatAlert={this.state.triggerChatAlert} setMessagesFalse={this.setMessagesFalse} />} />
              <Route path="/newchallengeform" component={() => <NewChallengeForm user={this.state.masterUser}/>} />
            </Side>
          </div>
          {/* {ChatAlert} */}
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));







































