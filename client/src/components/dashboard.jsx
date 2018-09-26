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

const Wrapper = styled.div`
  background: #191919;
  color: white;
  height: 100% !important;
`;

const TopWrapper = styled.div`
  display: flex;  
  flex-direction: row;
  justify-content: space-evenly;
  flex-wrap: wrap;
  width: 100%;
  ${'' /* border-bottom: 5px solid black; */}
  padding: 10px;
  margin-top: 15px;
  margin-bottom: 20px;
`;

const Heading = styled.h1`
  text-align: center;
  padding-bottom: 20px;
  font-size: 5rem;
  color: #6f999d;
`;

const SubHeading = styled.h1`
  color: #9ab751;
  font-size: 3rem;
`;

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      onDashboard: true
    };
    // this.onlineUpdate = this.onlineUpdate.bind(this);
  }
  componentDidMount() {
    console.log('I am on the dashboard: ', this.state.onDashboard);
    console.log('The user is: ', this.props.user);
    console.log("In dashboard, socket is ", this.props.socket);
    this.props.onlineUpdate();
  }

  // onlineUpdate() {
  //   this.props.socket.emit("onlineUpdate", this.props.user.username);
  // }


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
    let completed = this.props.user.completedInitial ? '✓' : '✘';
    console.log('coooommmmppp', user.completedInitial);
    console.log('AYYYYYYY', user);
    return <Wrapper>
        <TopWrapper>
          <Label size="huge" color="#191919">
            <Icon name="marker" />
            Current Level:
            <Label.Detail>{user.level}</Label.Detail>
          </Label>
          <Label size="huge" color="#191919">
            <Icon name="code" />
            Completed Challenges:
            <Label.Detail>{user.completedChallenges.length}</Label.Detail>
          </Label>
          <Label size="huge" color="#191919">
            <Icon name="trophy" />
            Site Ranking:
            <Label.Detail>{user.level}</Label.Detail>
          </Label>
        </TopWrapper>
        <Heading className="contentWhite">DASHBOARD</Heading>
        <Grid>
          <Grid.Row>
            <Grid.Column width={8}>
            <Card centered raised color="blue" style={{ width: "70%", minHeight: "40vh", background: "#191919", color:"white"}}>
                <Card.Content className="dashboardCard">
                  <Card.Header><SubHeading className="contentWhite">Tutorial Challenges</SubHeading></Card.Header>
                </Card.Content>
                <Card.Content className="dashboardCard">
                  <br />
                  <Feed>
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary className="contentWhite">
                        <h3>
                          {completed} {"\u00A0"}
                           <span style={completed === '✓' ? { textDecoration: "line-through" } : {}}>
                            Initial challenges completed 
                           </span>
                          </h3>
                        </Feed.Summary>
                        <Feed.Date className="contentGray" content="1 day ago" />
                      </Feed.Content>
                    </Feed.Event>
                    <br />
                    <br />
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary className="contentWhite">
                          <h3>
                            Course challenges completed:{" "}
                            {
                              Object.keys(user.completedCourseChallenges)
                                .length
                            }
                          </h3>
                        </Feed.Summary>
                        <Feed.Date className="contentGray" content="1 minute ago" />
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                  <br />
                  <br />
                  <Button as={Link} to="/course" content="Keep Learning" inverted size="large" style={{marginTop: "15px"}}/>
                </Card.Content>
              </Card>
            </Grid.Column>
            <Grid.Column width={8}>
            <Card centered raised color="blue" style={{ width: "70%", minHeight: "40vh", background: "#191919", color: "white" }}>
                <Card.Content className="dashboardCard">
                  <Card.Header><SubHeading className="contentWhite">User-made Challenges</SubHeading></Card.Header>
                </Card.Content>
                <Card.Content className="dashboardCard">
                  <Feed>
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary className="contentWhite">
                          <h3>
                            Total challenges completed:{" "}
                            {
                              Object.keys(user.completedChallenges)
                                .length
                            }
                          </h3>
                        </Feed.Summary>
                        <Feed.Date className="contentGray" content="1 hour ago" />
                      </Feed.Content>
                    </Feed.Event>
                    <br />
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary className="contentWhite">
                          <h3>Your solution upvotes: 0</h3>
                        </Feed.Summary>
                        <Feed.Date className="contentGray" content="1 hour ago" />
                      </Feed.Content>
                    </Feed.Event>
                    <br />
                    <Feed.Event>
                      <Feed.Content>
                        <Feed.Summary className="contentWhite">
                          <h3>Added challenges: 0</h3>
                        </Feed.Summary>
                        <Feed.Date className="contentGray" content="1 hour ago" />
                      </Feed.Content>
                    </Feed.Event>
                  </Feed>
                  <br />
                  <br />
                  <Button as={Link} to="/allChallenges" content="All Challenges" inverted size="large"/>
                </Card.Content>
              </Card>
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Wrapper>;
  }
}

export default Dashboard;