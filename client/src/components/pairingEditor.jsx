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
      endpoint: "localhost:3030",
      driver: true,
      navigator: false
    };
    this.onChange = this.onChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.socketEmit = this.socketEmit.bind(this);
  }

  componentDidMount() {
    // setInterval(this.socketEmit, 1000);
    this.state.socket.on("codeChangeFromServer", (code) => {
      if (this.state.navigator) {
        console.log("App heard the codeChange from the server");
        this.setState({ masterUserSolutionCode: code });
      }
    });
  }

  componentWillMount() {
    this.socketInitialize();
  }

  socketInitialize() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("connect", function() {
      console.log("Connected to socket from app.");
    });
    this.setState({socket: socket});
  }

  onChange(e) {
    this.setState({ masterUserSolutionCode: e || this.props.starterCode });
    if (this.state.driver) {
      // var socket = socketIOClient(this.state.endpoint);
      this.state.socket.emit("codeChange", this.state.masterUserSolutionCode);
    }
    
  }
  
  // socketEmit() {
  //   if (this.state.driver) {
  //     this.state.socket.emit("codeChange", this.state.masterUserSolutionCode);
  //   }
  // }


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

  switch(e) {
    this.setState({ pairing: !this.state.pairing });
  }

  switchRole(e) {
    this.setState({driver: !this.state.driver, navigator: !this.state.navigator});
  }

  render() {
   
    return (
      <div>
        You are currently {this.state.driver ? "Driver" : "Navigator"}.
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
        <Button onClick={this.switch.bind(this)} content="Exit to pair programming" />
        <Button onClick={this.switchRole.bind(this)} content="Switch roles" />
      </div>
    )
  }
}

export default PairingEditor;

