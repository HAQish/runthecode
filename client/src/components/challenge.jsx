import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import Success from './success.jsx';
import Failure from './failure.jsx';
import {Grid, Button, Modal, Header, Icon} from 'semantic-ui-react';
import $ from 'jquery';
//import init from '../../../database/seed/initalChallenges.json';

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialChallenges: [],
      currentChallengeID: 0,
      currentChallenge:   {},
      openTestModal: false,
      successMessage: true,
      currentTestResults: []
    }

    this.displayTestResults = this.displayTestResults.bind(this);
    this.closeTestModal = this.closeTestModal.bind(this);
    this.nextChallenge = this.nextChallenge.bind(this);
  }

  componentDidMount() {

    if (this.props.challengeName === 'initialChallenges') {
      $.ajax({
        type: 'GET',
        url: `/initialChallenges`,
        success: data => {
          this.setState({
            initialChallenges: data,
            currentChallengeID: 0,
            currentChallenge: this.state.initialChallenges[currentChallengeID]
          });
        },
        error: err => console.log('error getting challenges', err)
      });
    } else {
      $.ajax({
        type: 'GET',
        url: `/challenges/${this.props.challengeName}`,
        success: data => {
          this.setState({
            currentChallengeID: data.challengeNumber,
            currentChallenge: data,
          });
        },
        error: err => console.log('error getting challenge', err)
      });
    }
  }

  nextChallenge(challengeID) {
    $.ajax({
      type: 'GET',
      url: '/challenges/next',
      body: JSON.stringify(this.state.currentChallenge.challengeName),
      success: data => {
        this.setState({ 
          openTestModal: false,
          currentChallengeID: data.challengeNumber,
          currentChallenge: data 
        });
      },
      error: err => console.log('error getting next challenge', err)
    });
  }

  displayTestResults(results) {
    console.log('🤡', results);
    results = JSON.parse(results);
    if (results.message == 'Success') {
      this.setState({ 
        openTestModal: true, 
        successMessage: true, 
        currentTestResults: results.masterTestResults 
      });
    } 
    if (results.message === 'Failure') {
      // failure modal
      this.setState({ 
        openTestModal: true, 
        successMessage: false, 
        currentTestResults: results.masterTestResults 
      });
    }
  }

  closeTestModal() {
    this.setState({openTestModal: false});
  }

  render() {
    const { masterTestDescriptions } = this.state.currentChallenge;
    const { currentTestResults, currentChallenge } = this.state;

    const modalMessage = this.state.successMessage ? (<Success nextChallenge={this.nextChallenge} />) : 
    (<Failure closeTestModal={this.closeTestModal} currentTestResults={currentTestResults} masterTestDescriptions={masterTestDescriptions} />)

    return(
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={currentChallenge.masterTestDescriptions} challengeDescription={currentChallenge.prompt} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
          <Grid.Column>
            <Editor starterCode={currentChallenge.starterCode} masterTests={currentChallenge.masterTests} displayTestResults={this.displayTestResults} difficulty={currentChallenge.difficulty} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
        </Grid.Row>

        <Modal
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