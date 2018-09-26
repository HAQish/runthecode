import React from 'react';
import Signup from './signup.jsx';

import { Header, Grid, Button, Segment, Loader, Dimmer } from 'semantic-ui-react';
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
  console.log('basic tests', typeof props.basicTests, props.basicTests);
  if (props.challengeName) {
    const description = props.challengeDescription;
    const tests = JSON.parse(props.basicTests.replace("['", '["').replace("']", '"]').replace(/', '/g, '", "')).join("\n");
    // const tests = props.basicTests.map(test => <div key={test}>{test}</div>);
    return <Grid style={{ height: "100vh", paddingTop: "10vh" }} divided="vertically">
        <Grid.Row>
          <DataWrap className="challengeTopHalf">
            <Heading style={{color: "white", paddingBottom: "45px", position: "absolute", top:"-8.7vh"}}>{props.challengeName}</Heading>
            <Segment raised>
              <Header as="h3"  style={{color: "white", lineHeight: "25px", whiteSpace:"pre-line", overflowY: "auto", maxHeight:"43vh"}}>
                {description}
              </Header>
            </Segment>
          </DataWrap>
        </Grid.Row>

        <Grid.Row>
          <DataWrap className="challengeBottomHalf">
            <Heading style={{ color: "white", paddingBottom: "50px", left: "24vw", top:"4vh", position:"absolute"}}>Tests</Heading>
            <Segment raised style={{width: "42.7vw"}}>
              <Header as="h3" style={{ color: "white", lineHeight: "25px", whiteSpace: "pre-line", overflowY: "auto", maxHeight:"33vh", marginTop: "11vh"}}>
                {tests}
              </Header>
            </Segment>
          </DataWrap>
        </Grid.Row>
      </Grid>;
  } else {
    return <div className="challengeLoading">
      <br /> 
      <Segment>
        <Dimmer active>
          <Loader content="Loading" />
        </Dimmer>
      </Segment>
    </div>
  }
}

export default ChallengeInfo;