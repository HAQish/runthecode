import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import AceEditor from 'react-ace';
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

class ExampleNewChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeName: 'exampleChallenge',
      prompt: "write a function, myChallenge, that returns 'hello'",
      starterCode: "var myChallenge = function() {\n  return '_____';\n};",
      masterSolution: "var myChallenge = function() {\n  return 'hello'\n};",
      masterTests: "[typeof myChallenge === 'function', myChallenge() === 'hello']",
      testDescriptions: "['myChallenge should be a function', 'myChallenge should return hello']",
      challengeLevel: 4,
    };
  }

  render() {
    return(
      <div>
      <Header>Example challenge submission:</Header>
          <Segment inverted style={{marginBottom: '40px'}}>
            <Form inverted>
              <Form.Input fluid label='Challenge Name' name='challengeName' value={this.state.challengeName} />
              <Form.TextArea fluid label='Challenge Description' name='prompt' value={this.state.prompt} />
              <div>Starter code:</div>
              <AceEditor
                name="starterCode"
                mode="javascript" 
                theme="kuroir" 
                value={this.state.starterCode} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="10vh" 
                />
              <div>Master Solution:</div>
              <AceEditor
                name="masterSolution"
                mode="javascript" 
                theme="kuroir" 
                value={this.state.masterSolution} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="10vh" 
                />
              <div>Challenge Tests(array):</div>
              <AceEditor
                name="masterTests"
                mode="javascript" 
                theme="kuroir" 
                value={this.state.masterTests} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="5vh" 
                />
              <div>Test Descriptions(match indexes with tests):</div>
                <AceEditor
                name="testDescriptions"
                mode="javascript" 
                theme="kuroir" 
                value={this.state.testDescriptions} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="5vh" 
                />
                <Segment secondary>
                  <div>Challenge Difficulty Level: {this.state.challengeLevel}</div>
                    <input
                      type='range'
                      min='4'
                      max={15}
                      value={this.state.challengeLevel}
                    />
                </Segment>
            </Form>
          </Segment>
      </div>
    )
  }
}

export default ExampleNewChallengeForm;