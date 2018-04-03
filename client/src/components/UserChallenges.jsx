import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import ChallengeResultsModal from './challengeResultsModal.jsx'
import {Grid, Button, Modal, Header, Icon} from 'semantic-ui-react';
import $ from 'jquery';
import PairingEditor from "./pairingEditor.jsx";
import socketIOClient from "socket.io-client";
//import init from '../../../database/seed/initalChallenges.json';

class UserChallenges extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      openChallengeResultsModal: false,
      currentChallengeResultMessage: '', //"Success"/"Failure"/"Error" -- used to conditionally render ChallengeResultsModal
      currentTestDescriptions: [],
      currentTestResults: [],
      justCompletedInitial: false,
      currentUserCode: undefined,
      pairing: false,
      endpoint: "/",
      socket: undefined,
      socketId: undefined
    }
    this.displayTestResults = this.displayTestResults.bind(this);
    this.retry = this.retry.bind(this);
    this.nextChallenge = this.nextChallenge.bind(this);
    this.switch = this.switch.bind(this);
    this.socketInitialize = this.socketInitialize.bind(this);
  }

  //if user has not completed initialchallenges -> gets initialchallenges from server and populates state
  //if user has completed initialchallenges -> gets coursechallenges from server and populates state
  componentWillMount() {
    if (this.props.user.completedInitial === false) {
      $.get("/initialChallenges", (data) => {
          this.setState({
            initialChallenges: data,
            currentChallengeID: 0,
            currentChallenge: data[0]
          })
        }
      )
    } else {
      $.get("/courseChallenges", (data) => {
          this.setState({
            courseChallenges: data,
          })
        }
      )
    }
    this.socketInitialize();
  }

  //invoked when user clicks 'next problem' button in challengeResults modal
  //uses logic to
    //target next initialchallenge
    //get coursechallenges upon completion of initial
    //target next coursechallenge
  nextChallenge() {
    this.setState({currentUserCode: undefined});
    if (this.props.user.completedInitial === false && this.state.currentChallengeID != 4) {
      let next = this.state.currentChallengeID + 1;
      this.setState({
        currentChallengeID: next,
        openChallengeResultsModal:false,
        currentChallenge: this.state.initialChallenges[next],
      })
      if (next === 4) {
        this.setState({justCompletedInitial: true})
      }
    } else if (this.props.user.completedInitial === false && this.state.currentChallengeID === 4) {
        this.props.initialComplete(this.state.initialScore);
      this.setState({
        openChallengeResultsModal:false,
        currentChallengeID:0,
        justCompletedInitial: false
      })
      $.get('/courseChallenges', (data) => {
        this.setState({
          courseChallenges: data,
          currentChallenge: data[this.state.initialScore*2]
        })
      })
    } else if (this.props.user.completedInitial === true) {
      let next = this.state.currentChallengeID+1;
      this.setState({currentChallenge: this.state.courseChallenges[next], openChallengeResultsModal: false, currentChallengeID: next})
    }
};

//sets state to user challenge submission results...results = {"masterTestResults":[true,true],"message":"Success"} || {"masterTestResults":[true,false],"message":"Failure"} || {"masterTestResults":"'ReferenceError: hey is not defined'","message":"Error"}
  displayTestResults(results, userCode) {
    results = JSON.parse(results);
    this.setState({
      currentChallengeResultMessage: results.message,
      currentTestResults: results.masterTestResults,
      currentTestDescriptions: this.state.currentChallenge.masterTestDescriptions,
      openChallengeResultsModal: true,
      currentUserCode: userCode
    })
  }

  retry() {
    this.setState({
      openChallengeResultsModal: false,
      currentChallengeResultMessage: ''
    })
    if (this.state.justCompletedInitial) {
      this.setState({currentChallenge: this.state.courseChallenges[this.state.initialScore]})
    }
  }

  switch(e) {
    this.setState({ pairing: !this.state.pairing });
  }

  socketInitialize() {
    const socket = socketIOClient(this.state.endpoint);
    socket.on("connect", () => {
      console.log("Connected to socket from app, and socket id is", socket.id);
      this.setState({ socketId: socket.id });
    });
    this.setState({ socket: socket });
  }

 

  render() {
    var descriptions = this.state.currentChallenge.masterTestDescriptions
    const { currentChallenge } = this.state;
    const whichEditor = (this.state.pairing) ? 
      (<PairingEditor starterCode = { this.state.currentUserCode || currentChallenge.starterCode } testDescriptions = { currentChallenge.masterTestDescriptions } masterTests = { currentChallenge.masterTests } displayTestResults = { this.displayTestResults } challengeLevel = { currentChallenge.challengeLevel } challengeName = { currentChallenge.challengeName } switch= { this.switch } socketInitialize={this.socketInitialize} socket={this.state.socket} user={this.props.user}/>)
     : 
      (<Editor starterCode={this.state.currentUserCode || currentChallenge.starterCode} testDescriptions={currentChallenge.masterTestDescriptions} masterTests={currentChallenge.masterTests} displayTestResults={this.displayTestResults} challengeLevel={currentChallenge.challengeLevel} challengeName={currentChallenge.challengeName} switch={this.switch} />)
    


    return(
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={this.state.currentChallenge.masterTestDescriptions} challengeDescription={currentChallenge.prompt} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
          <Grid.Column>
            {whichEditor}
          </Grid.Column>
        </Grid.Row>
        <Modal
          style={{ height: '65%' }}
          basic
          style={{ height: "80%" }}
          open={this.state.openChallengeResultsModal}
          onClose={this.retry}>
          <ChallengeResultsModal
            initialScore={this.state.initialScore}
            msg={this.state.currentChallengeResultMessage}
            justCompletedInitial={this.state.justCompletedInitial}
            nextChallenge={this.nextChallenge}
            closeResultsModal={this.retry}
            testResults={this.state.currentTestResults}
            testDescriptions={descriptions}
          />
        </Modal>
      </Grid>
    );
  }
}

export default UserChallenges;