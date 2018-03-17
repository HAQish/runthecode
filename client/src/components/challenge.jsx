import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import {Grid, Button} from 'semantic-ui-react';

class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      basicTests: ['expect(helloWorld()).toEqual("Hello World")'],
      challengeName: 'Hello World',
      challengeDescription: 'Fill out the two variables so they RETURN the string "Hello World"',
      masterTestDescriptions: [],
      starterCode: 'function helloWorld() {\n  const hello="";\n  const world="";\n  _____ hello + world;\n}'
    }

    // this.showTestResults = this.showTestResults.bind(this);
  }

  // componentWillMount() {
  //   $.ajax({
  //     type: 'GET',
  //     url: `/challenges/${this.props.challengID}`
  //   },
  //   success: data => {
  //     this.setState({
  //       challengeName: data.challengeName,
  //       challengeDescription: data.challengeDescription,
  //       basicTests: data.basicTests,
  //       masterTestDescriptions: data.masterTestDescriptions,
  //       starterCode: data.starterCode
  //     });
  //   },
  //   error: err => console.log(err);
  //   )
  // }


  displayTestResults(results) {
    if (results.message === 'Success') {
      // success!
    } else if (results.message === 'Failure') {
      // failure
      //results.masterTestResults
      // compare to state.masterTestDescriptions
    } else {
      // display error message
    }
  }

  render() {
    const { starterCode, basicTests, challengeDescription, challengeName } = this.state;
    return(
      <Grid>
        <Grid.Row columns={2}>
          <Grid.Column>
            <ChallengeInfo basicTests={basicTests} challengeDescription={challengeDescription} challengeName={challengeName} />
          </Grid.Column>
          <Grid.Column>
            <Editor starterCode={starterCode} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

export default Challenge;