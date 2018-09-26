import React, { Component } from 'react';
import styled from 'styled-components';
import $ from 'jquery';
import {Grid, Button} from 'semantic-ui-react';
import AllChallengesListItem from './allChallengesListItem.jsx';
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  margin: 40px auto;
  justify-content: space-around;
  max-width: 70vw;
  text-align: center;
`;

class AllChallenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUser: undefined,
      challengeList: [],
      compChallengeNames: [],
    }
  }

  componentWillMount() {
    $.get('/isLoggedIn', data => {
      if (data !== undefined) {
        console.log('DAAAATTTTAAAA', data);
        this.setState({
          masterUser: data
        });
        let compChallenges = [];
        this.state.masterUser.completedChallenges.forEach(el =>
          compChallenges.push(el.challengeName)
        );
        this.setState({ compChallengeNames: compChallenges });
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
    return (
      <div>
        <Wrapper>
          <Grid celled>
            <Grid.Row className="info-header">
              <Grid.Column width={6}>
                <h3 className="challengeLabels">Challenge Name</h3>
              </Grid.Column>
              <Grid.Column width={2}>
                <h3 className="challengeLabels">Level</h3>
              </Grid.Column>
              <Grid.Column width={2}>
                <h3 className="challengeLabels">Solutions</h3>
              </Grid.Column>
              <Grid.Column width={6}>
                <h3 className="challengeLabels">Creator</h3>
              </Grid.Column>
            </Grid.Row>
            {this.state.challengeList.map((item) => (
              <AllChallengesListItem
                key={item.challengeName}
                user={user}
                compChallengeNames={this.state.compChallengeNames}
                challenge={item}
              />
            ))}
          </Grid>
        </Wrapper>;
        <Button as={Link} to="/newChallengeForm" content="Create a challenge!" inverted size="large" className="createChallengeBtn"/>
      </div>
    )
  }
}

export default AllChallenges;