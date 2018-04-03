import React, { Component } from 'react';
import Link from 'react-router-dom';
import styled from 'styled-components';
import $ from 'jquery';
import {Grid, Button} from 'semantic-ui-react';
import AllChallengesListItem from './allChallengesListItem.jsx';

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
`;

class AllChallenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUser: undefined,
      challengeList: [],
    }
  }

  // componentWillMount() {
  //   // const {params} = this.props.match.params;
  //   console.log('parameters', this.props.match.params)
  //   $.get(`/userSubmittedChallenge/${this.props.match.params.challengeName}`, (data) => {
  //     this.setState({response: data});
  //   });
  // }

  componentWillMount() {
    $.get('/isLoggedIn', data => {
      console.log('🌴', data);
      if (data !== undefined) {
        this.setState({
          masterUser: data
        });
      } else {
        this.setState({
          masterUser: undefined
        });
      }
    });
  }

  componentDidMount() {
    $.get('/challengeList', data => {
      this.setState({
        challengeList: data
      })
    })
  }

  // challenge name
  // challenge level
  // user completed?
  // view solutions? - number of solutions
  // challenge ranking (based on upvotes or downvotes)
  render(){
    const user = this.state.masterUser;
    return <Wrapper>
        <Grid celled>
          <Grid.Row className="info-header">
            <Grid.Column width={10}>Name</Grid.Column>
            <Grid.Column width={2}>Level</Grid.Column>
            <Grid.Column width={2}>Solutions</Grid.Column>
            <Grid.Column width={2}>User Rankings</Grid.Column>
          </Grid.Row>
          <div>all challenges component ====== {this.state.response}</div>
          {this.state.challengeList.map(item => (
            <AllChallengesListItem user={user} challenge={item} />
          ))}
        </Grid>
      </Wrapper>;
  }
}

export default AllChallenges;