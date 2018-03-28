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
    return <div style={{ height: "100vh" }}>
        <TopWrapper>
          <Label as={Link} size="huge" color="black">
            <Icon name="marker" />
            Current Level:
            <Label.Detail>???</Label.Detail>
          </Label>
          <Label as={Link} size="huge" color="black">
            <Icon name="code" />
            Completed Challenges:
            <Label.Detail>???</Label.Detail>
          </Label>
          <Label as={Link} size="huge" color="black">
            <Icon name="trophy" />
            Site Ranking:
            <Label.Detail>???</Label.Detail>
          </Label>
          <Label as={Link} size="huge" color="black">
            <Icon name="users" inverted />
            USERS
          </Label>
          <Label as={Link} size="huge" color="black">
            <Icon name="mail outline" />
            Messages
            <Label.Detail>???</Label.Detail>
          </Label>
        </TopWrapper>
        <Heading>DASHBOARD</Heading>
      </div>;
  }
}

export default Dashboard;