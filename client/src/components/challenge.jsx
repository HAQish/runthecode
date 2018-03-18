import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import Success from './success.jsx';
import Failure from './failure.jsx';
import {Grid, Button, Modal, Header, Icon} from 'semantic-ui-react';
import init from '../../../database/seed/initalChallenges.json';

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      initialChallenges: [],
      currentChallenge: this.state.initialChallenges[this.state.currentChallengeID],
      openTestModal: false,
      successMessage: true,
      currentChallengeID: 0
    }

    this.displayTestResults = this.displayTestResults.bind(this);
    this.closeTestModal = this.closeTestModal.bind(this);
    this.nextChallenge = this.nextChallenge.bind(this);
  }

  componentWillMount() {

    this.setState({initialChallenges: init});
    // $.ajax({
    //   type: 'GET',
    //   url: `/challenges/initialChallenges`,
    //   success: data => {
    //     this.setState({
    //       challengeName: data[0].challengeName,
    //       challengeDescription: data.challengeDescription,
    //       basicTests: data.basicTests,
    //       masterTestDescriptions: data.masterTestDescriptions,
    //       starterCode: data.starterCode
    //     });
    //   },
    // error: err => console.log(err)
    // });
  }

  nextChallenge(challengeID) {
    this.setState({currentChallengeID: this.state.currentChallengeID + 1});
  }


  displayTestResults(results) {
    console.log('🤡', results);
    results = JSON.parse(results);
    if (results.message == 'Success') {
      this.setState({ openTestModal: true, successMessage: true });
    } 
    if (results.message === 'Failure') {
      // failure modal
      console.log('😈')
      this.setState({openTestModal: true, successMessage: false})
      //results.masterTestResults
      // compare to state.masterTestDescriptions
    }
  }

  closeTestModal() {
    this.setState({openTestModal: false});
  }

  render() {
    const modalMessage = this.state.successMessage ? (<Success nextChallenge={this.nextChallenge} />) : (<Failure closeTestModal={this.closeTestModal} />)
    const { starterCode, masterTestDescriptions, prompt, challengeName } = this.state.currentChallenge;
    return(
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={masterTestDescriptions} challengeDescription={prompt} challengeName={challengeName} />
          </Grid.Column>
          <Grid.Column>
            <Editor starterCode={starterCode} displayTestResults={this.displayTestResults} />
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