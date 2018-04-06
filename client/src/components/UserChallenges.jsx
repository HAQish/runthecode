import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import AllChallengesResultsModal from './allChallengesResultsModal.jsx';
import {Grid, Button, Modal, Header, Icon} from 'semantic-ui-react';
import $ from 'jquery';
import PairingEditor from "./pairingEditor.jsx";
import socketIOClient from "socket.io-client";

class UserChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openChallengeResultsModal: false,
      // currentChallengeResultMessage: "", //"Success"/"Failure"/"Error" -- used to conditionally render ChallengeResultsModal
      currentTestDescriptions: [],
      currentTestResults: [],
      justCompletedInitial: false,
      currentUserCode: undefined,
      pairing: false,
      theme: "kuroir"
    };
    this.displayTestResults = this.displayTestResults.bind(this);
    this.retry = this.retry.bind(this);
    this.viewSolutions = this.viewSolutions.bind(this);
    this.switch = this.switch.bind(this);
  }

  // categories []
  // challengeLevel "" /////
  // challengeName "" //////
  // createdAt ""
  // createdBy ""
  // hints []
  // masterSolution ""
  // masterTests "[]" /////
  // prompt "" /////
  // resources []
  // starterCode "" ///////
  // submittedSolutions []
  // testDescriptions "[]" /////

  componentDidMount() {
    console.log("in UserChallenges.jsx, socket is", this.props.socket);
    $.get(`/userSubmittedChallenge/${this.props.match.params.challengeName}`, (data) => {
      console.log('Data after get to userchallenges', data)
      this.setState({
        challengeLevel: data.challengeLevel,
        challengeName: data.challengeName,
        masterTests: data.masterTests,
        prompt: data.prompt,
        starterCode: data.starterCode,
        testDescriptions: data.testDescriptions,
        showSolutions: false,
        submittedSolutions: data.submittedSolutions,
      });
    });
  }
  
  displayTestResults(results, userCode) {
    results = JSON.parse(results);
    this.setState({
      currentChallengeResultMessage: results.message,
      currentTestResults: results.masterTestResults,
      currentTestDescriptions: this.state.testDescriptions,
      openChallengeResultsModal: true,
      currentUserCode: userCode
    });
  }

  retry() {
    this.setState({
      openChallengeResultsModal: false,
      currentChallengeResultMessage: ""
    });
  }

  viewSolutions() {
    this.setState({
      showSolutions: true
    })
  }

  switch(e) {
    this.setState({pairing: !this.state.pairing })
  }

  render() {
    const whichEditor = this.props.match.params.roomName !== undefined ? (
      <PairingEditor
        starterCode={this.state.currentUserCode || this.state.starterCode}
        testDescriptions={this.state.testDescriptions}
        masterTests={this.state.masterTests}
        displayTestResults={this.displayTestResults}
        challengeLevel={this.state.challengeLevel}
        challengeName={this.state.challengeName}
        switch={this.switch}
        socket={this.props.socket}
        user={this.props.user}
        room={this.props.match.params}
        theme={this.state.theme}
      />
    ) : (
      <Editor
        destinationUrl="/allChallenges"
        starterCode={this.state.currentUserCode || this.state.starterCode}
        testDescriptions={this.state.testDescriptions}
        masterTests={this.state.masterTests}
        displayTestResults={this.displayTestResults}
        challengeLevel={this.state.challengeLevel}
        challengeName={this.state.challengeName}
        switch={this.switch}
        socket={this.props.socket}
        user={this.props.user}
        theme={this.state.theme}
      />
    );

    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo
              basicTests={this.state.testDescriptions}
              challengeDescription={this.state.prompt}
              challengeName={this.state.challengeName}
            />
          </Grid.Column>
          <Grid.Column>{whichEditor}</Grid.Column>
        </Grid.Row>
        <Modal
          style={{ height: "65%" }}
          basic
          style={{ height: "80%" }}
          open={this.state.openChallengeResultsModal}
          onClose={this.retry}
        >
          <AllChallengesResultsModal
            msg={this.state.currentChallengeResultMessage}
            solutions={this.state.submittedSolutions}
            challengeName={this.state.challengeName}
            viewSolutions={this.viewSolutions}
            showSolutions={this.state.showSolutions}
            closeResultsModal={this.retry}
            testResults={this.state.currentTestResults}
            testDescriptions={this.state.testDescriptions}
          />
        </Modal>
      </Grid>
    );
  }
}

export default UserChallenges;