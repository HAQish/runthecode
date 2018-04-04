import React, { Component } from 'react';
import Link from 'react-router-dom';
import styled from 'styled-components';
import $ from 'jquery';
import {Grid, Button} from 'semantic-ui-react';
import AllChallengesListItem from './allChallengesListItem.jsx';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: auto;
  justify-content: space-around;
  width: 70vw;
  text-align: center;
`;

class AllChallenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUser: undefined,
      challengeList: [],
    }
  }

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
    console.log('INSIDE COMPDIDMOUNT IN ALLCHALLENGES')
    $.get('/challengeList', data => {
      console.log("❓❓❓❓", data);
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
            <Grid.Column width={8}>
              <h3>Challenge Name</h3>
            </Grid.Column>
            <Grid.Column width={2}>
              <h3>Level</h3>
            </Grid.Column>
            <Grid.Column width={2}>
              <h3>Solutions</h3>
            </Grid.Column>
            <Grid.Column width={2}>
              <h3>Created By</h3>
            </Grid.Column>
          </Grid.Row>
          {this.state.challengeList.map((item, i) => (
            <AllChallengesListItem
              index={i}
              key={item.challengeName}
              user={user}
              challenge={item}
            />
          ))}
        </Grid>
      </Wrapper>;
  }
}

export default AllChallenges;