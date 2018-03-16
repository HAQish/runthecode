import React from 'react';
import Signup from './signup.jsx';

import { Header, Grid, Button } from 'semantic-ui-react';

const ChallengeInfo = (props) => {
  return(
    <Grid>
      <Grid.Row>
        <div style={{margin: 'auto', height: '50%'}}>
          <Header as='h1' content='Problem Name' />
          <Header as='h3' content='Problem Description goes here' />
        </div>
      </Grid.Row>
      
      <Grid.Row>
        <div style={{ margin: 'auto' }}>
          Sample tests will go here
        </div>
      </Grid.Row>
    </Grid>
  )
}

export default ChallengeInfo;