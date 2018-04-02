import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import styled from 'styled-components';

import {
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
    let completed = this.props.user.completedInitial ? 'YES' : 'NO';
    console.log('coooommmmppp', user.completedInitial);
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
        <Heading>Welcome {user.username} to your DASHBOARD</Heading> */}

        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
              <Card centered raised color="blue" style={{ width: "70%" }}>
                <Card.Content>
                  <Card.Header>Your Learning Path</Card.Header>
                </Card.Content>
                <Card.Content>
                  <br />
                  <Feed>
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary>
                          <h3>
                            Initial Challenges Completed: {completed}
                          </h3>
                        </Feed.Summary>
                        <Feed.Date content="1 day ago" />
                      </Feed.Content>
                    </Feed.Event>
                    <br />
                    <br />
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary>
                          <h3>
                            Course Challenges Completed:{" "}
                            {
                              Object.keys(user.completedCourseChallenges)
                                .length
                            }
                          </h3>
                        </Feed.Summary>
                        <Feed.Date content="3 hours ago" />
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                  <br />
                  <br />
                  <Button as={Link} to="/course" content="Keep Learning" primary />
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={8}>
              <Card centered raised color="blue" style={{ width: "70%" }}>
                <Card.Content>
                  <Card.Header>Your Challenge Path</Card.Header>
                </Card.Content>
                <Card.Content>
                  <Feed>
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary>
                          <h3>
                            Total Challenges Completed:{" "}
                            {
                              Object.keys(user.completedCourseChallenges)
                                .length
                            }
                          </h3>
                        </Feed.Summary>
                        <Feed.Date content="1 hour ago" />
                      </Feed.Content>
                    </Feed.Event>
                    <br />
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary>
                          <h3>Your Solution Upvotes: 0</h3>
                        </Feed.Summary>
                        <Feed.Date content="1 hours ago" />
                      </Feed.Content>
                    </Feed.Event>
                    <br />
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary>
                          <h3>Added Challenges: 0</h3>
                        </Feed.Summary>
                        <Feed.Date content="1 hours ago" />
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                  <br />
                  <br />
                  <Button as={Link} to="/allChallenges" content="All Challenges" primary />
                  <Button as={Link} to="/newChallengeForm" content="Create a challenge!" primary />
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
          <br />
          <br />
        </Grid>
      </div>;
  }
}

export default Dashboard;