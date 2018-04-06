import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';

import 'brace/theme/kuroir';
import 'brace/theme/ambiance';
import 'brace/theme/chaos';
import 'brace/theme/chrome';
import 'brace/theme/clouds';
import 'brace/theme/cobalt';
import 'brace/theme/dawn';
import 'brace/theme/dracula';
import 'brace/theme/dreamweaver';
import 'brace/theme/eclipse';
import 'brace/theme/gob';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import { Grid, Button } from 'semantic-ui-react';

import socketIOClient from "socket.io-client";

class PairingEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUserSolutionCode: '',
      challengeResults: [],
      pairing: false,
      driver: false,
      driverArr: [],
      navigator: true,
      chatMessages: [],
      users: [],
      theme: "kuroir"
    };
    this.onChange = this.onChange.bind(this);
    this.switchRole = this.switchRole.bind(this);
    this.chatOnChange = this.chatOnChange.bind(this);
    this.sendChat = this.sendChat.bind(this);    
    this.joinSocketRoom = this.joinSocketRoom.bind(this);
    this.getOnlineUsers = this.getOnlineUsers.bind(this);
    this.inviteUser = this.inviteUser.bind(this);
    this.switchRoleSocket = this.switchRoleSocket.bind(this);
    this.getUsersInSession = this.getUsersInSession.bind(this);
    this.changeThemeToambiance = this.changeThemeToambiance.bind(this);
    this.changeThemeTochaos = this.changeThemeTochaos.bind(this);
    this.changeThemeTochrome = this.changeThemeTochrome.bind(this);
    this.changeThemeToclouds = this.changeThemeToclouds.bind(this);
    this.changeThemeTocobalt = this.changeThemeTocobalt.bind(this);
    this.changeThemeTodawn = this.changeThemeTodawn.bind(this);
    this.changeThemeTodracula = this.changeThemeTodracula.bind(this);
    this.changeThemeTodreamweaver = this.changeThemeTodreamweaver.bind(this);
    this.changeThemeToeclipse = this.changeThemeToeclipse.bind(this);
    this.changeThemeTogob = this.changeThemeTogob.bind(this);
    
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.socketEmit = this.socketEmit.bind(this);
  }

  componentDidMount() {
    // setInterval(this.socketEmit, 1000);
    console.log("in pairingEditor.jsx, this.props", this.props);
    setTimeout(this.joinSocketRoom, 1500);
    this.props.socket.on("codeChangeFromServer", (code) => {
      if (this.state.navigator) {
        console.log("App heard the codeChange from the server");
        this.setState({ masterUserSolutionCode: code });
      }
    });
    this.props.socket.on("returnOnlineUsers", (usersArr) => {
      // console.log("In Users.jsx, usersArr returned from backend is", usersArr);
      this.setState({ users: usersArr });
    });
    console.log("in pairingEditor, this.props.user", this.props.user);
  }

  componentWillMount() {
    console.log("in pairingEditor.jsx, this.props", this.props);
    console.log("in pairingEditor, this.props.room.roomName", this.props.room.roomName);
    this.setState({roomName: this.props.room.roomName.split("").reverse().join("").slice(0, 18)});
    // console.log("In pairingEditor.jsx, socket is", this.props.socket);
    setInterval(this.getPairingId.bind(this), 5000);
    this.props.socket.on("socketIdFromPartner", (partnerId) => {
      this.setState({partnerId : partnerId});
    });
    this.props.socket.on("sendChatFromServer", (chatMsg) => {
      this.setState({chatMessages: this.state.chatMessages.concat(chatMsg)});
    })
    this.props.socket.on("getUsersInSession", (users) => {
      this.setState({usersInSession: users});
    })
    setInterval(this.getOnlineUsers, 2500);
    setInterval(this.getUsersInSession, 1000);
    // this.props.socket.on("newDriver", (username) => {
    //   if (this.state.driverArr.length === 0) {
    //     this.state.driverArr.push(username);
    //   } else {
    //     alert("There is already a driver.");
    //   }
    // })
  }

  getOnlineUsers() {
    this.props.socket.emit("getOnlineUsers");
  }

  getUsersInSession() {
    this.props.socket.emit("getUsersInSession", this.state.roomName);
  }

  componentWillUnmount() {
    //leave room
    // this.props.socket.leave(this.state.roomName);
    this.props.socket.emit("leaveRoom", {roomName: this.state.roomName, username: this.props.user.username, role: this.state.driver ? "driver" : "navigator"});
  }

  joinSocketRoom() {
    this.props.socket.emit("joinRoom", {roomName: this.state.roomName, username: this.props.user.username, role: this.state.driver ? "Driver" : "Navigator"});
  }

  onChange(e) {
    this.setState({ masterUserSolutionCode: e || this.props.starterCode });
    if (this.state.driver) {
      this.props.socket.emit("codeChange", {code: this.state.masterUserSolutionCode, roomName: this.state.roomName});
    }
    
  }
  
  getPairingId() {
    this.props.socket.emit("componentWillMountPairing", { id: this.props.socket.id, roomName: this.state.roomName});
  }


  handleSubmit(e) {
    e.preventDefault();
    const { masterTests, displayTestResults, difficulty, challengeName } = this.props;
    const { masterUserSolutionCode } = this.state;
    $.ajax({
      type: "POST",
      url: "/challengeSolution",
      data: {
        masterUserSolutionCode: masterUserSolutionCode,
        masterTests: masterTests,
        challengeLevel: this.props.challengeLevel,
        challengeName: challengeName
      },
      success: data => {
        displayTestResults(data, masterUserSolutionCode);
        this.setState({ masterUserSolutionCode: '' })
      },
      error: err => console.log(err)
    });
  }

  // switch(e) {
  //   this.setState({ pairing: !this.state.pairing });
  // }

  switchRole(e) {
    if (this.state.navigator && this.state.usersInSession.some(el => el[1] === "Driver")) { 
      // if switching to driver and there is already at least one driver
      alert("There is already a driver.")
    } else {
      this.setState({driver: !this.state.driver, navigator: !this.state.navigator}, this.switchRoleSocket);
    }
  }

  switchRoleSocket() {
    this.props.socket.emit("roleChange", {user: this.props.user.username, role: this.state.driver ? "Driver" : "Navigator", roomName: this.state.roomName});
  }

  chatOnChange(e) {
    this.setState({chat: e.target.value});
  }

  sendChat() {
    //socket stuff
    this.props.socket.emit("sendChatFromApp", {message: this.state.chat, id: this.props.socket.id, user: this.props.user.username, role: this.state.driver ? "Driver" : "Navigator", roomName: this.state.roomName});
  }

  inviteUser(id, to) {
    this.props.socket.emit("sendChatMessage", { message: window.location.href, meantFor: id, from: this.props.user.username, to: to });
  }

  changeThemeToambiance() {
    this.setState({ theme: "ambiance" });
  }

  changeThemeTochaos() {
    this.setState({ theme: "chaos" });
  }

  changeThemeTochrome() {
    this.setState({ theme: "chrome" });
  }

  changeThemeToclouds() {
    this.setState({ theme: "clouds" });
  }

  changeThemeTocobalt() {
    this.setState({ theme: "cobalt" });
  }

  changeThemeTodawn() {
    this.setState({theme: "dawn"});
  } 
   
  changeThemeTodracula() {
    this.setState({theme: "dracula"});
  }
  
  changeThemeTodreamweaver() {
    this.setState({theme: "dreamweaver"});
  }
  
  changeThemeToeclipse() {
    this.setState({theme: "eclipse"});
  }
  
  changeThemeTogob() {
    this.setState({theme: "gob"});
  }
  
  render() {
    const driverImg = "https://cdn.iconscout.com/public/images/icon/premium/png-128/steering-wheel-component-accessories-car-33c7476fa85b2199-128x128.png";
    const navigatorImg ="http://icons.iconarchive.com/icons/icons8/android/256/Maps-Compass-icon.png"; 
    // const users = this.state.users;
    return (
      <div>
        You are currently {this.state.driver ? "Driver" : "Navigator"}. <br /> <br />
        The current socket id is {this.props.socketId || this.props.socket.id}. <br />
        Your partner's socket id is {this.state.partnerId}. <br />
        <button onClick={this.changeThemeToambiance}>ambiance</button>
        <button onClick={this.changeThemeTochaos}>chaos</button>
        <button onClick={this.changeThemeTochrome}>chrome</button>
        <button onClick={this.changeThemeToclouds}>clouds</button>
        <button onClick={this.changeThemeTocobalt}>cobalt</button>
        <button onClick={this.changeThemeTodawn}>dawn</button> 
        <button onClick={this.changeThemeTodracula}>dracula</button>   
        <button onClick={this.changeThemeTodreamweaver}>dreamweaver</button>   
        {/* <button onClick={this.changeThemeToeclipse}>eclipse</button>   
        <button onClick={this.changeThemeTogob}>gob</button>        */}
        <AceEditor
          mode='javascript'
          theme={this.state.theme || "kuroir"}
          onChange={this.onChange}
          value={this.state.masterUserSolutionCode || this.props.starterCode}
          editorProps={{ $blockScrolling: true }}
          width='100%'
          height='85vh'
        />
        <Button onClick={this.handleSubmit} content="Send to server" primary /> <br />
        <br />
        <Button onClick={this.props.switch} content="Exit to pair programming" />
        <Button onClick={this.switchRole} content="Switch roles" /> <br /> 
        {this.state.users.map(user => {
          return (<div>
            {user[0]} <button onClick={() => this.inviteUser(user[1], user[0])}>Invite this user to this session</button>
            
            </div>)

        })}        
        
        <br />

        <br /><br />
        <input placeholder="chat here" onChange={this.chatOnChange}/> 
          <Button onClick={this.sendChat} content="Send" />
        {this.state.chatMessages.map((el, i) => <div key={i}><img src={el.role === "Driver" ? driverImg : navigatorImg} width="13px" height="13px" />{el.user}: {el.message}</div>)}
      </div>
    )
  }
}

export default PairingEditor;

