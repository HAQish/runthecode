import React from 'react';
import $ from 'jquery';
import SolutionListEntry from './SolutionListEntry.jsx';
import styled from 'styled-components';
import {
  Modal,
  Button,
  Image,
  Icon,
  Header,
  Grid,
  Segment,
  Container,
  Label,
  Form,
  Card,
  Feed
} from "semantic-ui-react";

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 40px auto;
  justify-content: space-around;
  width: 70vw;
  text-align: center;
`;

const Heading = styled.h3`
  text-align: center;
  padding-bottom: 20px;
  font-size: 3rem;
  color: #6f999d;
`;

class SolutionList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeLevel: '',
      challengeName: '',
      submittedSolutions: [],
    }
  }
  componentWillMount() {
    $.get(`/userSubmittedChallenge/${this.props.match.params.challengeName}`, (data) => {
      console.log('Data after get to userchallenges', data)
      this.setState({
        challengeLevel: data.challengeLevel,
        challengeName: data.challengeName,
        testDescriptions: data.testDescriptions,
        submittedSolutions: data.submittedSolutions,
      });
    });
  }

  render(){
    console.log('🤡', this.state.submittedSolutions);
    return <Wrapper>
        <Grid divided="vertically">
          <Grid.Row>
            <Heading>Solutions for {this.state.challengeName}</Heading>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={3}>
              <h3>UpVote / DownVote</h3>
            </Grid.Column>
            <Grid.Column width={1}>
              <h3>Votes</h3>
            </Grid.Column>
            <Grid.Column width={2}>
              <h3>User</h3>
            </Grid.Column>
            <Grid.Column width={2}>
              <h3>Date/Time</h3>
            </Grid.Column>
            <Grid.Column width={8}>
              <h3>Submitted Solution</h3>
            </Grid.Column>
          </Grid.Row>
          {this.state.submittedSolutions.map(solution => (
            <SolutionListEntry key={solution._id} solution={solution} />
          ))}
        </Grid>
      </Wrapper>;
  }
};

export default SolutionList;