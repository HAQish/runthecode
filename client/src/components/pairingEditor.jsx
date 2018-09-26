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
import { Dropdown, Menu } from 'semantic-ui-react'

import {Link} from 'react-router-dom';
import socketIOClient from "socket.io-client";

const chatStyle = {
  overflowY: 'scroll',
  border:'1px solid black',
  width:'100%',
  height:'200px',
  position:'relative',
  backgroundColor: 'white',
  padding: "10px",
  marginTop: "10px"
};
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
      usersInSession: [],
      usernamesArr: [],
      currentDriver: "",
      theme: localStorage.editorTheme || "kuroir"
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
    this.handleSubmit = this.handleSubmit.bind(this);
    this.switchBack = this.switchBack.bind(this);
    this.dropDownChange = this.dropDownChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
      for (let i = 0; i < this.state.usersInSession.length; i++) {
        for (let j = 0; j < usersArr.length; j++) {
          if (this.state.usersInSession[i][0] === usersArr[j][0]) {
            usersArr[j] = "removeMe";
          }
        }
      }

      for (let i = 0; i < usersArr.length; i++) {
        if (usersArr[i] === "removeMe") {
          usersArr.splice(i, 1);
          i = -1;
        }
      }

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
      let usernamesArr = [];
      users = users === null ? [] : users;
      let currentDriver = "";
      for (let i = 0; i < users.length; i++) {
        usernamesArr.push(users[i][0]);
      }

      for (let i = 0; i < users.length; i++) {
        if (users[i][1] === "Driver") {
          currentDriver = users[i][0];
        }
      }
      this.setState({usernamesArr: usernamesArr});
      this.setState({usersInSession: users});
      this.setState({currentDriver: currentDriver});
    })
    setInterval(this.getOnlineUsers, 2500);
    setInterval(this.getUsersInSession, 1500);
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
    const { masterTests, displayTestResults, difficulty, challengeName, challengeLevel } = this.props;
    const { masterUserSolutionCode } = this.state;
    $.ajax({
      type: "POST",
      url: "/allChallenges",
      data: {
        masterUserSolutionCode: masterUserSolutionCode,
        masterTests: masterTests,
        challengeLevel: challengeLevel,
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
    this.props.socket.emit("sendChatFromApp", {
      message: this.state.chat, 
      id: this.props.socket.id, 
      user: this.props.user.username, 
      role: this.state.driver ? "Driver" : "Navigator", 
      roomName: this.state.roomName
    });
    this.setState({chat: ""});
  }

  inviteUser(id, to) {
    this.props.socket.emit("sendChatMessage", { 
      message: window.location.href, 
      meantFor: id, 
      from: this.props.user.username, 
      to: to 
    });
  }
  
  switchBack() {
    this.props.switch()
  };

  dropDownChange(e, data) {
    console.log("dropDownChange", e, data);
    localStorage.editorTheme = data.value;
    this.setState({theme: data.value});
  }


  render() {
    const driverImg = "https://cdn.iconscout.com/public/images/icon/premium/png-128/steering-wheel-component-accessories-car-33c7476fa85b2199-128x128.png";
    const navigatorImg ="http://icons.iconarchive.com/icons/icons8/android/256/Maps-Compass-icon.png"; 
    const options = [
      { key: 1, text: 'ambiance', value: "ambiance" },
      { key: 2, text: 'chaos', value: "chaos" },
      { key: 3, text: 'chrome', value: "chrome" },
      { key: 4, text: 'clouds', value: "clouds"},   
      { key: 5, text: 'cobalt', value: "cobalt"},
      { key: 6, text: 'dawn', value: "dawn"}, 
      { key: 7, text: 'dracula', value: "dracula"}, 
      { key: 8, text: 'dreamweaver', value: "dreamweaver"}, 
      { key: 9, text: 'eclipse', value: "eclipse"}, 
      { key: 10, text: 'gob', value: "gob"}
    ];
    const currentDriver = (this.state.navigator && this.state.currentDriver ? "The current driver is " + this.state.currentDriver  : "");
    // const users = this.state.users;
    return <div style={{ color: "white" }} className="fontSansSerif">
        You are currently {this.state.driver ? "Driver" : "Navigator"}.{'  '}{currentDriver}<br /> 
        {/* var usersInSession={JSON.stringify(this.state.usernamesArr).replace("\",\"", "\", \"")} */}
        <br />
        {/* The current socket id is {this.props.socketId || this.props.socket.id}. <br /> */}
        {/* Your partner's socket id is {this.state.partnerId}. <br /> */}
        <Menu compact style={{ marginBottom: "13px", backgroundColor: "#404040" }}>
          <Dropdown text='Editor Theme' options={options} simple item onChange={this.dropDownChange} style={{ padding: "10px 7px", color: "white" }} />
        </Menu> 
        <AceEditor
          mode='javascript'
          theme={this.state.theme}
          onChange={this.onChange}
          value={this.state.masterUserSolutionCode || this.props.starterCode}
          editorProps={{ $blockScrolling: true }}
          width='100%'
          height='40vh'
        />
        <Button onClick={this.handleSubmit} content="Send to server" primary /> 
        {/* <br /> */}
        {/* <br /> */}
        <Button onClick={this.switchRole} content="Switch roles" /> 
        {/* <br />  */}
        <Button as={Link} to={`/allchallenges/${this.props.challengeName}`} content="Exit pair programming" />
        <br />
        Users currently in this session: {this.state.usernamesArr.map(user => <span>{user} </span>)}
        <br /> <br />
        Invite other online users: <br />
        {this.state.users.map(user => {
          return <div>
              {user[0]} <Button size="tiny"
                onClick={() => this.inviteUser(user[1], user[0])}
              >
                Invite this user to this session
              </Button>
            </div>;
        })}
        <br />
        <input value={this.state.chat} placeholder="Chat here" onChange={this.chatOnChange} style={{color: "black"}}/>
        <Button onClick={this.sendChat} content="Send" style={{padding: "4px", marginLeft: "8px"}}/>
        <div style={chatStyle}>
          {this.state.chatMessages.map((el, i) => <div key={i} style={{color: "black"}}>
              <img src={el.role === "Driver" ? driverImg : navigatorImg} width="13px" height="13px" />
              {' '} {el.user}: {el.message}
            </div>)}
        </div>
      </div>;
  }
}

export default PairingEditor;

