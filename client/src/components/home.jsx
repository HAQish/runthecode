import React from 'react';
import Editor from './editor.jsx';
import Signup from './signup.jsx';
import HomeResultsPopup from './HomeResultsPopup.jsx';
import { Container, Segment, Button, Header, Icon, Card, Image, List, Grid, Modal } from 'semantic-ui-react';
import $ from 'jquery';

import AceEditor from 'react-ace';
import Brace from 'brace';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

// import Confetti from "react-dom-confetti";
import Confetti from "./confetti.jsx";

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starterChallenge: {
        prompt: "Write a function called helloWorld that RETURNS the string 'Hello World' using two variables",
        // starterCode: "function helloWorld() { \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n }",
        masterTests: "[typeof helloWorld === 'function', helloWorld() === 'Hello World']",
        masterTestDescriptions: ['helloWorld should be a function', 'return value should be Hello World'],
        challengeNumber: 1,
        challengeName: "Hello World!",
      },
      masterSolutionCode: "function helloWorld() {\n  //make me return Hello World \n  const hello = 'Hello'; \n  const world = ' World'; \n  _____ hello + world //FIX ME \n}",
      openModal: false,
      msg: '',
      openResults: false,
      isLoadingHomeResults: false,
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmitToServer = this.onSubmitToServer.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.onBegin = this.onBegin.bind(this);
  }

  onChange(e) {
    this.setState({masterSolutionCode: e});
  }

  onSubmitToServer() {
    const { masterTests } = this.state.starterChallenge;
    const { masterSolutionCode } = this.state;
    this.setState({ isLoadingHomeResults: true });
    console.log('😇', masterSolutionCode);
    $.ajax({
      type: "POST",
      url: "/challengeSolution",
      data: {
        masterUserSolutionCode: masterSolutionCode,
        masterTests: masterTests
      },
      success: data => {
        var results = JSON.parse(data);
        console.log('✋ Success!', results);
        this.setState({
          openResults: true,
          msg: results.message,
          isLoadingHomeResults: false,
        });
        if (results.message === "Success") {
          this.setState({ openModal: true });
        }
      },
      error: err => console.log(err)
    });
  }

  onBegin() {
    this.setState({openModal:true})
  }

  closeModal() {
    this.setState({openModal: false});
  }

  componentDidMount() {
    document.querySelector(".pusher").style.background = "none";
  }

  componentWillUnmount() {
    console.log("home unmounting");
    document.querySelector(".pusher").style.background = "#191919";
  }

  handleLoginSubmit(user) {
    this.setState({openModal: false});
    this.props.handleLogin(user);
  }

  render() {
    const { prompt, challengeName, masterTestDescriptions } = this.state.starterChallenge;
    const { masterSolutionCode } = this.state;
    const config = {
      angle: 360,
      spread: 360,
      startVelocity: 80,
      elementCount: 171,
      decay: 0.77
    };
    return <div style={{ marginTop: "0px" }}>
        <Confetti active={this.state.msg === "Success"} config={config} className="confettiStuff" />
        <div className="homepage banner">
          <Header icon inverted textAlign="center" size="huge" style={{ paddingTop: "20px" }}>
            <Icon name="code" size="big" inverted circular />
            <Header.Content className="homeLogoText">LevelUP Code</Header.Content>
          </Header>
          <div className="parent">
            <Image className="monitor" src="images/monitor.png" />
            <div className="editor">
              <AceEditor className="editor" mode="javascript" theme="kuroir" onChange={this.onChange} value={masterSolutionCode} editorProps={{ $blockScrolling: true }} width="100%" height="100%" />
              <HomeResultsPopup submit={this.onSubmitToServer.bind(this)} open={this.state.openResults} msg={this.state.msg} loading={this.state.isLoadingHomeResults} />
              <Button className="small homebutton" onClick={this.onBegin} primary content="Begin your journey" style={{ float: "right", marginBottom: "10px" }} />
            </div>
            <Modal style={{ height: "65%" }} basic dimmer style={{ height: "80%" }} closeOnDimmerClick open={this.state.openModal} onClose={this.closeModal}>
              <Header icon="signup" content="Signup" className="nav-item" >
              </Header>
              <Button color="gray" onClick={this.closeModal} className="signupClose" style={{position: "absolute", top: "16px"}}>
                X
              </Button>
              <Modal.Content style={{marginTop: "50px"}}>
                <Modal.Description>
                
                  <Header inverted>
                  <span className="signupHeader">Get Ready for a coding experience like no other</span>
                  </Header>
                  <Signup handleLogin={this.handleLoginSubmit} />
                </Modal.Description>
              </Modal.Content>
              <Modal.Actions>
              </Modal.Actions>
            </Modal>
          </div>
        </div>
      </div>
  }
}

export default Home;