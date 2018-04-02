import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
import AceEditor from 'react-ace';
import ExampleNewChallengeForm from './ExampleNewChallengeForm.jsx';
import ChallengeResultsModal from './challengeResultsModal.jsx'
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

class NewChallengeForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challengeName: '',
      prompt: "",
      starterCode: "",
      masterSolution: "",
      masterTests: "[]",
      testDescriptions: "[]",
      challengeLevel: 4,

      testMsg: '',
      testResults: '',
      openTestResultsModal: false,
    };
    this.onStarterCodeChange = this.onStarterCodeChange.bind(this);
    this.onMasterTestsChange = this.onMasterTestsChange.bind(this);
    this.onMasterSolutionChange = this.onMasterSolutionChange.bind(this);
    this.handleFormChange = this.handleFormChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSliderChange = this.handleSliderChange.bind(this);
    this.onTestDescriptionsChange = this.onTestDescriptionsChange.bind(this);
    this.displayTestResults = this.displayTestResults.bind(this);
    this.retry = this.retry.bind(this);
  }

  displayTestResults(results) {
    results = JSON.parse(results);
    this.setState({
      testMsg: results.message,
      testResults: results.masterTestResults,
      openTestResultsModal: true,
    })
  }

  toDashboard() {
    //NEEDS:
    //success on submission
    //redirect to dashboard
    this.setState({
      challengeName: '',
      prompt: "",
      starterCode: "",
      masterSolution: "",
      masterTests: "[]",
      testDescriptions: "[]",
      challengeLevel: 4,

      testMsg: '',
      testResults: '',
      openTestResultsModal: false,
    })
  };

  retry() {
    this.setState({
      openTestResultsModal: false
    })
  };

  onStarterCodeChange(e) {
    this.setState({starterCode: e})
  };
  onMasterTestsChange(e) {
    this.setState({masterTests: e})
  };
  onMasterSolutionChange(e) {
    this.setState({masterSolution: e})
  };
  onTestDescriptionsChange(e) {
    this.setState({testDescriptions: e})
  };

  handleFormChange(e, {name, value}) {
    this.setState({
      [name]: value
    });
  };

  handleSliderChange(e) {
    this.setState({
      challengeLevel: Number(e.target.value)
    })
  };

  handleSubmit() {
    var newChallenge = {
      challengeName: this.state.challengeName,
      prompt: this.state.prompt,
      starterCode: this.state.starterCode,
      masterSolution: this.state.masterSolution,
      masterTests: this.state.masterTests,
      testDescriptions: this.state.testDescriptions,
      challengeLevel: this.state.challengeLevel
    };
    $.post('/userSubmittedChallenge', {newChallenge: newChallenge, user: this.props.user}, (data) => this.displayTestResults(data))
  };

  render() {
    return(
      <div style={{height: "100vh"}}>
      <Grid style={{marginLeft: '10px', marginRight: '10px'}} centered={true}>
      <Grid.Row style={{marginTop: '20px', marginBottom: '30px'}}>
      <Grid.Column width={8}>
      <ExampleNewChallengeForm/>
      </Grid.Column>
        
        <Grid.Column width={8}>
        <Header>Create your challenge here:</Header>
          <Segment inverted style={{marginBottom: '40px'}}>
            <Form inverted>
              <Form.Input fluid label='Challenge Name' name='challengeName' value={this.state.challengeName} onChange={this.handleFormChange} />
              <Form.TextArea fluid label='Challenge Description' name='prompt' value={this.state.prompt} onChange={this.handleFormChange} placeholder='Write a description and any instructions necessary...' />
              <div>Starter code:</div>
              <AceEditor
                name="starterCode"
                mode="javascript" 
                theme="kuroir" 
                onChange={this.onStarterCodeChange} 
                value={this.state.starterCode} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="10vh" 
                />
              <div>Master Solution:</div>
              <AceEditor
                name="masterSolution"
                mode="javascript" 
                theme="kuroir" 
                onChange={this.onMasterSolutionChange} 
                value={this.state.masterSolution} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="10vh" 
                />
              <div>Challenge Tests(array, use single quotes for strings):</div>
              <AceEditor
                name="masterTests"
                mode="javascript" 
                theme="kuroir" 
                onChange={this.onMasterTestsChange} 
                value={this.state.masterTests} 
                editorProps={{ $blockScrolling: true }} 
                width="100%" height="5vh" 
                />
                <div>Test Descriptions(match indexes with tests, single quotes for strings):</div>
                <AceEditor
                name="testDescriptions"
                mode="javascript" 
                theme="kuroir" 
                value={this.state.testDescriptions}
                onChange={this.onTestDescriptionsChange}
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
                      onChange={this.handleSliderChange}
                    />
                </Segment>
              <Form.Button fluid primary type='submit' onClick={this.handleSubmit}>Submit Challenge</Form.Button>
            </Form>
          </Segment>
        </Grid.Column>
      </Grid.Row>
      <Modal
          style={{ height: '65%' }}
          basic
          style={{ height: "80%" }}
          open={this.state.openTestResultsModal}
          onClose={this.retry}>
          <ChallengeResultsModal
            msg={this.state.testMsg}
            nextChallenge={this.toDashboard}
            closeResultsModal={this.retry}
            testResults={this.state.testResults}
            testDescriptions={this.state.testDescriptions}
          />
        </Modal>
      </Grid>
      </div>
    )
  }
}

export default NewChallengeForm;