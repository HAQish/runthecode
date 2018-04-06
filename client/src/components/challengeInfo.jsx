import React from 'react';
import Signup from './signup.jsx';

import { Header, Grid, Button, Segment } from 'semantic-ui-react';
import styled from 'styled-components';

const DataWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px 100px 20px 100px;
  height: 30vh;
  textAlign: center;
`;

const Heading = styled.h1`
  color: #6f999d;
  font-size: 3rem;
  padding-bottom: 30px;
  padding-top: 20px;
`;

const SubHeading = styled.h3`

`;

const ChallengeInfo = (props) => {
  console.log('basic tests', props.basicTests);
  // const tests = props.basicTests.map(test => <div key={test}>{test}</div>);
  return <Grid style={{ height: "80vh" }} divided="vertically">
      <Grid.Row>
        <DataWrap>
          <Heading>{props.challengeName}</Heading>
          <Segment raised>
            <Header as="h3" content={props.challengeDescription} />
          </Segment>
        </DataWrap>
      </Grid.Row>

      <Grid.Row>
        <DataWrap>
          <Heading>Tests</Heading>
          <Segment raised>
            <Header as="h3" content={props.basicTests} />
          </Segment>
        </DataWrap>
      </Grid.Row>
    </Grid>;
}

export default ChallengeInfo;