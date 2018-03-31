import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';

import 'brace/theme/kuroir';
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
      driver: true,
      navigator: false,
      chatMessages: []
    };
    this.onChange = this.onChange.bind(this);
    this.switchRole = this.switchRole.bind(this);
    this.chatOnChange = this.chatOnChange.bind(this);
    this.sendChat = this.sendChat.bind(this);    
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.socketEmit = this.socketEmit.bind(this);
  }

  componentDidMount() {
    // setInterval(this.socketEmit, 1000);
    this.props.socket.on("codeChangeFromServer", (code) => {
      if (this.state.navigator) {
        console.log("App heard the codeChange from the server");
        this.setState({ masterUserSolutionCode: code });
      }
    });
    console.log(this.props.socket);
  }

  componentWillMount() {
    // this.props.socketInitialize();
    console.log("In pairingEditor.jsx, socket is", this.props.socket);
    setInterval(this.getPairingId.bind(this), 5000);
    this.props.socket.on("socketIdFromPartner", (partnerId) => {
      this.setState({partnerId : partnerId});
    });
    this.props.socket.on("sendChatFromServer", (chatMsg) => {
      this.setState({chatMessages: this.state.chatMessages.concat(chatMsg)});
    })
  }

  // socketInitialize() {
  //   const socket = socketIOClient(this.state.endpoint);
  //   socket.on("connect", () => {
  //     console.log("Connected to socket from app, and socket id is", socket.id);
  //     this.setState({socketId: socket.id});
  //   });
  //   this.setState({socket: socket});
  // }

  onChange(e) {
    this.setState({ masterUserSolutionCode: e || this.props.starterCode });
    if (this.state.driver) {
      // var socket = socketIOClient(this.state.endpoint);
      this.props.socket.emit("codeChange", this.state.masterUserSolutionCode);
    }
    
  }
  
  getPairingId() {
    this.props.socket.emit("componentWillMountPairing", this.props.socket.id);
  }


  // handleSubmit(e) {
  //   e.preventDefault();
  //   const { masterTests, displayTestResults, difficulty, challengeName } = this.props;
  //   const { masterUserSolutionCode } = this.state;
  //   $.ajax({
  //     type: "POST",
  //     url: "/challengeSolution",
  //     data: {
  //       masterUserSolutionCode: masterUserSolutionCode,
  //       masterTests: masterTests,
  //       challengeLevel: this.props.challengeLevel,
  //       challengeName: challengeName
  //     },
  //     success: data => {
  //       displayTestResults(data, masterUserSolutionCode);
  //       this.setState({ masterUserSolutionCode: '' })
  //     },
  //     error: err => console.log(err)
  //   });
  // }

  // switch(e) {
  //   this.setState({ pairing: !this.state.pairing });
  // }

  switchRole(e) {
    this.setState({driver: !this.state.driver, navigator: !this.state.navigator});
  }

  chatOnChange(e) {
    this.setState({chat: e.target.value})
  }

  sendChat() {
    //socket stuff
    this.props.socket.emit("sendChatFromApp", {message: this.state.chat, id: this.props.socket.id, user:this.props.user.username, role: this.state.driver ? "Driver" : "Navigator"});
  }

  render() {
    const driverImg = "https://cdn.iconscout.com/public/images/icon/premium/png-128/steering-wheel-component-accessories-car-33c7476fa85b2199-128x128.png";
    const navigatorImg ="http://icons.iconarchive.com/icons/icons8/android/256/Maps-Compass-icon.png"; 
    return (
      <div>
        You are currently {this.state.driver ? "Driver" : "Navigator"}. <br /> <br />
        The current socket id is {this.props.socketId || this.props.socket.id}. <br />
        Your partner's socket id is {this.state.partnerId}.
        <AceEditor
          mode='javascript'
          theme="kuroir"
          onChange={this.onChange}
          value={this.state.masterUserSolutionCode || this.props.starterCode}
          editorProps={{ $blockScrolling: true }}
          width='100%'
          height='85vh'
        />
        {/*<Button onClick={this.handleSubmit} content="Send to server" primary />*/} <br />
        <br />
        <Button onClick={this.props.switch} content="Exit to pair programming" />
        <Button onClick={this.switchRole} content="Switch roles" /> <br /> <br />

        <input placeholder="chat here" onChange={this.chatOnChange}/> 
          <Button onClick={this.sendChat} content="Send" />
        {this.state.chatMessages.map((el, i) => <div key={i}><img src={el.role === "Driver" ? driverImg : navigatorImg} width="13px" height="13px" />{el.user}: {el.message}</div>)}
      </div>
    )
  }
}

export default PairingEditor;

