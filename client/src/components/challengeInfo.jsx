import React from 'react';
import Signup from './signup.jsx';

import { Header, Grid, Button } from 'semantic-ui-react';

const ChallengeInfo = (props) => {
  return(
    <Grid>
      <Grid.Row>
        <div style={{margin: 'auto', height: '50%'}}>
          <Header as='h1' content={props.challengeName} />
          <Header as='h3' content={props.challengeDescription} />
        </div>
      </Grid.Row>
      
      <Grid.Row>
        <div style={{ margin: 'auto' }}>
          {props.basicTests}
        </div>
      </Grid.Row>
    </Grid>
  )
}

export default ChallengeInfo;