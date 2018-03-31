import React from 'react';
import Signup from './signup.jsx';

import { Header, Grid, Button } from 'semantic-ui-react';
import styled from 'styled-components';

const DataWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 100px;
  height: 50%;
  textAlign: center;
`;

const ChallengeInfo = (props) => {
  // const tests = JSON.parse(props.basicTests);
  console.log('basic tests', props.basicTests);
  // const tests = props.basicTests.map(test => <div key={test}>{test}</div>);
  return <Grid style={{ height: "100vh" }} divided='vertically'>
      <Grid.Row>
        <DataWrap>
          <Header as="h1" content={props.challengeName} />
          <Header as="h3" content={props.challengeDescription} />
        </DataWrap>
      </Grid.Row>

      <Grid.Row>
        <DataWrap>
          <Header as="h1" content="Tests" />
          <Header as="h3" content={props.basicTests} />
        </DataWrap>
      </Grid.Row>
    </Grid>;
}

export default ChallengeInfo;