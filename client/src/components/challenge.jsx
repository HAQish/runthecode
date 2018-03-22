import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import Success from './success.jsx';
import Failure from './failure.jsx';
import completedInitialModal from './completedInitialModal.jsx';
import {Grid, Button, Modal, Header, Icon} from 'semantic-ui-react';
import $ from 'jquery';
//import init from '../../../database/seed/initalChallenges.json';

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialChallenges: [],
      initialScore: 0,
      courseChallenges: [],
      currentChallengeID: 0,
      currentChallenge: {},
      openTestModal: false,
      successMessage: true,
      currentTestResults: [],
      openCompletedInitialModal: false,
    }
    this.displayTestResults = this.displayTestResults.bind(this);
    this.closeTestModal = this.closeTestModal.bind(this);
    this.nextChallenge = this.nextChallenge.bind(this);
  }

  componentWillMount() {
    if (this.props.user.completedInitial === false) {
      $.ajax({
        type: 'GET',
        url: `/initialChallenges`,
        success: data => {
          console.log('compwillmount data:', data)
          this.setState({
            initialChallenges: data,
            currentChallengeID: 0,
            currentChallenge: data[0]
          });
        },
        error: err => console.log('error getting challenges', err)
      });
    } else {
      $.ajax({
        type: 'GET',
        url: `/courseChallenges`,
        success: data => {
          this.setState({
            courseChallenges: data,
          });
        },
        error: err => console.log('error getting challenge', err)
      });
    }
  }

  nextChallenge() {
    if (this.props.user.completedInitial === false && this.state.currentChallengeID != 4) {
      let next = this.state.currentChallengeID + 1;
      this.setState({
        currentChallengeID: next,
        openTestModal:false,
        currentChallenge: this.state.initialChallenges[next],
      })
      if (next === 4) {
        this.setState({openCompletedInitialModal: true})
      }
    } else if (this.props.user.completedInitial === false && this.state.currentChallengeID === 4) {
        this.props.initialComplete(this.state.initialScore);
      //process completion of initial challenges
      this.setState({
        openTestModal:false,
        currentChallengeID:0,
        openCompletedInitialModal: false
      })
      $.get('/courseChallenges', (data) => {
        this.setState({
          userCompletedInitial: true,
          courseChallenges: data,
          currentChallenge: data[this.state.initialScore*2]
        })
      })
        //get level back
        //recommendation of starting point
        //change completed initial to true
        //redirect them to recomended starting challenge
    } else if (this.props.user.completedInitial === true) {
      let next = this.state.currentChallengeID+1;
      this.setState({currentChallenge: this.state.courseChallenges[next], openTestModal: false, currentChallengeID: next})
      //handle coursechallenge info here
    }
};

  displayTestResults(results) {
    console.log('🤡', results);
    results = JSON.parse(results);
    if (results.message == 'Success') {
      this.setState({ 
        openTestModal: true, 
        successMessage: true, 
        currentTestResults: results.masterTestResults,
        initialScore: this.state.initialScore+0.5
      });
    } 
    else if (results.message === 'Failure') {
      // failure modal
      this.setState({ 
        openTestModal: true, 
        successMessage: false, 
        currentTestResults: results.masterTestResults 
      });
    }
    else if (results.message === 'Error') {
      this.setState({
        openTestModal: true,
        successMessage: false,
        currentTestResults: results.masterTestResults
      })
    }
  }

  closeTestModal() {
    this.setState({openTestModal: false})
    if (this.state.openCompletedInitialModal) {
      this.setState({currentChallenge: this.state.courseChallenges[this.state.initialScore]})
    }
  }

  render() {
    const { currentChallenge } = this.state;

    const modalMessage = this.state.successMessage ? (<Success initialJustCompleted={this.state.openCompletedInitialModal} nextChallenge={this.nextChallenge} />) : 
    (<Failure nextChallenge={this.nextChallenge} closeTestModal={this.closeTestModal} initialJustCompleted={this.state.openCompletedInitialModal} currentTestResults={this.state.currentTestResults} masterTestDescriptions={this.state.currentChallenge.masterTestDescriptions} />)

    return(
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={this.state.currentChallenge.masterTestDescriptions} challengeDescription={currentChallenge.prompt} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
          <Grid.Column>
            <Editor starterCode={currentChallenge.starterCode} masterTests={currentChallenge.masterTests} displayTestResults={this.displayTestResults} challengeLevel={currentChallenge.challengeLevel} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
        </Grid.Row>
        <Modal
          initialScore={this.state.initialScore}
          style={{ height: '65%' }}
          basic
          dimmer
          style={{ height: "80%" }}
          closeOnDimmerClick
          open={this.state.openTestModal}
          onClose={this.closeTestModal}>
          {modalMessage}
        </Modal>
      </Grid>
    );
  }
}

export default Challenge;










// this.state = {
//   initialChallenges: [
//     {
//       "prompt": "Write a function called helloWorld that Returns the string 'Hello World' using two variables example: helloWorld() // returns 'Hello World'",
//       "starterCode": "function helloWorld() { \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n }",
//       "masterTests": "[typeof helloWorld === 'function', helloWorld() === 'Hello World']",
//       "masterTestDescriptions": "['helloWorld should be a function', 'return value should be Hello World']",
//       "challengeNumber": 1,
//       "challengeName": "Hello World!",
//       "difficulty": "2"
//     },