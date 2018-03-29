import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import ChallengeResultsModal from './challengeResultsModal.jsx'
import { Grid, Button, Modal, Header, Icon } from 'semantic-ui-react';
import $ from 'jquery';

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialChallenges: [],
      initialScore: 0,
      courseChallenges: [],
      currentChallengeID: 0,
      currentChallenge: {},
      /* current challenge examples
      initial challenge -> {"_id":"5ab2e6d70ac83a9e404f3a9d","prompt":"Write a function called helloWorld that Returns the string 'Hello World' using two variables example: helloWorld() // returns 'Hello World'","starterCode":"function helloWorld() { \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n }","masterTests":"[typeof helloWorld === 'function', helloWorld() === 'Hello World']","masterTestDescriptions":"['helloWorld should be a function', 'return value should be Hello World']","challengeNumber":1,"challengeName":"Hello World!"}
      course challenge -> {"_id":"5ab2e6da0ac83a9e404f3aa2","prompt":"JavaScript can define a variable using the 'var' keyword.  '=' assigns a value, '==' and '===' asserts equality between values.  Check out the examples and then fill in the blanks.","starterCode":"// examples: \n var aNumber = 3;  // typeof aNumber === 'number' \n var aString = 'I am learning JavaScript!';  // typeof aString = 'string' \n var aBoolean = true;  // typeof aBoolean === 'boolean' \n // the typeof operator returns a string indicating the data type \n \n // Fill in the blanks/Fix errors in code \n ___ myNumber = 4; \n ___ myBoolean = 'true'; \\ typeof myBoolean should equal 'boolean' \n  \n // Advanced \n // What would the result of this be? \n // typeof(typeof myNumber); \n var myAnswer = '_____'","masterTests":"[typeof myNumber = 'number', typeof myBoolean === 'boolean', myAnswer === 'string']","masterTestDescriptions":"['myNumber should be a number', 'myBoolean should be a boolean', 'myAnswer should be string']","challengeLevel":1,"challengeNumber":1,"challengeName":"Variables"}
      */
      openChallengeResultsModal: false,
      currentChallengeResultMessage: '', //"Success"/"Failure"/"Error" -- used to conditionally render ChallengeResultsModal
      currentTestDescriptions: [],
      currentTestResults: [],
      justCompletedInitial: false,
      currentUserCode: undefined,
    }
    this.displayTestResults = this.displayTestResults.bind(this);
    this.retry = this.retry.bind(this);
    this.nextChallenge = this.nextChallenge.bind(this);
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
          currentChallengeID: 0,
          courseChallenges: data,
          currentChallenge: data[0]
        })
      })
    }
  }

  //invoked when user clicks 'next problem' button in challengeResults modal
  //uses logic to
  //target next initialchallenge
  //get coursechallenges upon completion of initial
  //target next coursechallenge
  nextChallenge() {
    this.setState({ currentUserCode: undefined });
    if (this.props.user.completedInitial === false && this.state.currentChallengeID != 4) {
      let next = this.state.currentChallengeID + 1;
      this.setState({
        currentChallengeID: next,
        openChallengeResultsModal: false,
        currentChallenge: this.state.initialChallenges[next],
      })
      if (next === 4) {
        this.setState({ justCompletedInitial: true })
      }
    } else if (this.props.user.completedInitial === false && this.state.currentChallengeID === 4) {
      this.props.initialComplete(this.state.initialScore);
      this.setState({
        openChallengeResultsModal: false,
        currentChallengeID: 0,
        justCompletedInitial: false
      })
      $.get('/courseChallenges', (data) => {
        this.setState({
          courseChallenges: data,
          currentChallengeID: this.state.intialScore*2,
          currentChallenge: data[this.state.initialScore * 2]
        })
      })
    } else if (this.props.user.completedInitial === true) {
      let next = this.state.currentChallengeID + 1;
      this.setState({ currentChallenge: this.state.courseChallenges[next], openChallengeResultsModal: false, currentChallengeID: next })
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
      currentChallengeResultMessage: '',
      // currentUserCode: userCode
    })
    if (this.state.justCompletedInitial) {
      this.setState({ currentChallenge: this.state.courseChallenges[this.state.initialScore] })
    }
  }

  render() {
    var descriptions = this.state.currentChallenge.masterTestDescriptions
    const { currentChallenge } = this.state;
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={this.state.currentChallenge.masterTestDescriptions} challengeDescription={currentChallenge.prompt} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
          <Grid.Column>
            <Editor starterCode={this.state.currentUserCode || currentChallenge.starterCode} testDescriptions={currentChallenge.masterTestDescriptions} masterTests={currentChallenge.masterTests} displayTestResults={this.displayTestResults} challengeLevel={currentChallenge.challengeLevel} challengeName={currentChallenge.challengeName} />
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

export default Challenge;