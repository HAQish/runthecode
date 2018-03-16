import React from 'react';
import ChallengeInfo from './challengeInfo.jsx';
import Editor from './editor.jsx';
import {Grid, Button} from 'semantic-ui-react';

const Challenge = (props) => {

  // componentWillMount() {
  //   // now I have data
  //   this.setState({
  //     data
  //   })
  // }
  // <Link to="/challenge" component={challenge} />
  return(
    <Grid>
      <Grid.Row columns={2}>
        <Grid.Column>
          <ChallengeInfo />
        </Grid.Column>
        <Grid.Column>
          <Editor />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  )
}

export default Challenge;