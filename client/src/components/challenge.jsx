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
      openChallengeResultsModal: false,
      currentChallengeResultMessage: '', //"Success"/"Failure"/"Error" -- used to conditionally render ChallengeResultsModal
      currentTestDescriptions: [],
      currentTestResults: [],
      justCompletedInitial: false,
      currentUserCode: undefined,
      courseComplete: false, //(this.props.user.completedInitial===true && this.state.courseChallenges[this.state.currentChallengeID+1]===undefined),
    }
    this.displayTestResults = this.displayTestResults.bind(this);
    this.retry = this.retry.bind(this);
    this.nextChallenge = this.nextChallenge.bind(this);
  }

  //if user has not completed initialchallenges -> gets initialchallenges from server and populates state
  //if user has completed initialchallenges -> gets coursechallenges from server and populates state
  componentWillMount() {
    console.log('✋✋✋✋✋', this.props);
    if (this.props.user) {
      if (this.props.user.completedInitial === false) {
        $.get("/initialChallenges", (data) => {
          this.setState({
            initialChallenges: data,
            currentChallengeID: Object.keys(this.props.user.completedCourseChallenges).length,
            currentChallenge: data[Object.keys(this.props.user.completedCourseChallenges).length]
          })
        }
        )
      } else {
        $.get("/courseChallenges", (data) => {
          this.setState({
            currentChallengeID: Object.keys(this.props.user.completedCourseChallenges).length,
            courseChallenges: data,
            currentChallenge: data[Object.keys(this.props.user.completedCourseChallenges).length]
          })
        })
      }
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
    } else if (this.state.courseComplete) {
      this.setState({openChallengeResultsModal: false});
    }
    
      else if (this.props.user.completedInitial === true) {
      let next = this.state.currentChallengeID + 1;
      this.setState({ currentChallenge: this.state.courseChallenges[next], openChallengeResultsModal: false, currentChallengeID: next })
    }
  };

  //sets state to user challenge submission results...results = {"masterTestResults":[true,true],"message":"Success"} || {"masterTestResults":[true,false],"message":"Failure"} || {"masterTestResults":"'ReferenceError: hey is not defined'","message":"Error"}
  displayTestResults(results, userCode) {
    results = JSON.parse(results);
    if (this.props.user.completedInitial===true && this.state.courseChallenges[this.state.currentChallengeID+1]===undefined) {
      this.setState({courseComplete: true})
    };
    this.setState({
      currentChallengeResultMessage: results.message,
      currentTestResults: results.masterTestResults,
      currentTestDescriptions: this.state.currentChallenge.masterTestDescriptions,
      openChallengeResultsModal: true,
      currentUserCode: userCode
    });
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
    var descriptions = this.state.currentChallenge.masterTestDescriptions;
    console.log('descriptionssssssssssss', descriptions);
    const { currentChallenge } = this.state;
    return (
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={this.state.currentChallenge.masterTestDescriptions} challengeDescription={currentChallenge.prompt} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
          <Grid.Column>
            <Editor destinationUrl="/challengeSolution" starterCode={this.state.currentUserCode || currentChallenge.starterCode} testDescriptions={currentChallenge.masterTestDescriptions} masterTests={currentChallenge.masterTests} displayTestResults={this.displayTestResults} challengeLevel={currentChallenge.challengeLevel} challengeName={currentChallenge.challengeName} />
          </Grid.Column>
        </Grid.Row>
        <Modal
          style={{ height: '65%' }}
          basic
          style={{ height: "80%" }}
          open={this.state.openChallengeResultsModal}
          onClose={this.retry}>
          <ChallengeResultsModal
            courseComplete={this.state.courseComplete}
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