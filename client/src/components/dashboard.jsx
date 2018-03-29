import React from 'react';
import $ from 'jquery';
import Link from 'react-router-dom';
import styled from 'styled-components';

import {
  Button,
  Image,
  Icon,
  Header,
  Grid,
  Segment,
  Container,
  Label
} from "semantic-ui-react";

const TopWrapper = styled.div`
  display: flex;  
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  border-bottom: 5px solid black;
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const Heading = styled.h1`
  text-align: center;
  padding-bottom: 20px;
  font-size: 5rem;
`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onDashboard: true
    };
  }
  componentDidMount() {
    console.log('I am on the dashboard: ', this.state.onDashboard);
    console.log('The user is: ', this.props.user);
  }

  // Friends
  // Site ranking
  // Current Level
    // Current XP
  // Challenges passed
    // your solutions
  // Available Challenges
  // Find a mentor
  // Become a mentor
  

  render() {
    const { user } = this.props;
    return <div style={{ height: "100vh" }}>
        <TopWrapper>
          <Label size="huge" color="black">
            <Icon name="marker" />
            Current Level:
            <Label.Detail>{user.level}</Label.Detail>
          </Label>
          <Label size="huge" color="black">
            <Icon name="code" />
            Completed Challenges:
            <Label.Detail>{user.completedChallenges.length}</Label.Detail>
          </Label>
          <Label size="huge" color="black">
            <Icon name="trophy" />
            Site Ranking:
            <Label.Detail>{user.level}</Label.Detail>
          </Label>
          <Label as={Link} to="/users" size="huge" color="black">
            <Icon name="users" inverted />
            USERS
          </Label>
          <Label size="huge" color="black">
            <Icon name="mail outline" />
            Messages
            <Label.Detail>0</Label.Detail>
          </Label>
        </TopWrapper>
        <Heading>DASHBOARD</Heading>
        <Grid columns={2}>
          
        </Grid>
      </div>;
  }
}

export default Dashboard;