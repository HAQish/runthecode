import React from 'react';
import Editor from './editor.jsx';
import Signup from './signup.jsx';
import HomeResultsPopup from './HomeResultsPopup.jsx';
import { Container, Segment, Button, Header, Icon, Card, Image, List, Grid, Modal } from 'semantic-ui-react';
import $ from 'jquery';

import AceEditor from 'react-ace';
import Brace from 'brace';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      starterChallenge: {
        prompt: "Write a function called helloWorld that RETURNS the string 'Hello World' using two variables",
        // starterCode: "function helloWorld() { \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n }",
        masterTests: "[typeof helloWorld === 'function', helloWorld() === 'Hello World']",
        masterTestDescriptions: ['helloWorld should be a function', 'return value should be Hello World'],
        challengeNumber: 1,
        challengeName: "Hello World!",
      },
      masterSolutionCode: "function helloWorld() {\n//make me return Hello World \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n}",
      openModal: false,
      msg: '',
      openResults: false,
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmitToServer = this.onSubmitToServer.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleLoginSubmit = this.handleLoginSubmit.bind(this);
    this.onBegin = this.onBegin.bind(this);
  }

  onChange(e) {
    this.setState({masterSolutionCode: e});
  }

  onSubmitToServer() {
    const { masterTests } = this.state.starterChallenge;
    const { masterSolutionCode } = this.state;
    console.log('😇', masterSolutionCode);
    $.ajax({
      type: "POST",
      url: "/challengeSolution",
      data: {
        masterUserSolutionCode: masterSolutionCode,
        masterTests: masterTests
      },
      success: data => {
        var results = JSON.parse(data);
        console.log('✋ Success!', results);
        this.setState({
          openResults: true,
          msg: results.message,
        });
      },
      error: err => console.log(err)
    });
  }

  onBegin() {
    this.setState({openModal:true})
  }

  closeModal() {
    this.setState({openModal: false});
  }
  handleLoginSubmit(user) {
    this.setState({openModal: false});
    this.props.handleLogin(user);
  }

  render() {
    const { prompt, challengeName, masterTestDescriptions } = this.state.starterChallenge;
    const { masterSolutionCode } = this.state;
    return(
      <div style={{marginTop: '0px'}} >
      <div className='homepage banner'>
        <Header icon inverted textAlign='center' size='huge' style={{paddingTop: '20px'}}>
          <Icon name='code' size='big' inverted circular />
          <Header.Content>
            LevelUP Code
          </Header.Content>
        </Header>
        <div className='parent'>
          <Image className='monitor' src='images/monitor.png' />
          <div className='editor'>
          <AceEditor
            className='editor'
            mode='javascript'
            theme="kuroir"
            onChange={this.onChange}
            value={masterSolutionCode}
            editorProps={{ $blockScrolling: true }}
            width='100%'
            height='100%'
          />
          <HomeResultsPopup submit={()=>{this.onSubmitToServer()}} open={this.state.openResults} msg={this.state.msg}/>
          <Button onClick={this.onBegin} primary content='Begin your journey' style={{float: 'left', marginBottom: '10px'}}/>
          </div>
        </div>
        <Modal
          style={{ height: '65%' }}
          basic
          dimmer
          style={{ height: "80%" }}
          closeOnDimmerClick
          open={this.state.openModal}
          onClose={this.closeModal}>
          <Header icon='signup' content='Signup' />
          <Modal.Content>
            <Modal.Description>
              <Header inverted>Get Ready for a coding experience like no other</Header>
              <Signup handleLogin={this.handleLoginSubmit} />
            </Modal.Description>
          </Modal.Content>
          <Modal.Actions >
            <Button color='red' onClick={this.closeModal}>
              <Icon name='remove' /> Close
            </Button>
          </Modal.Actions>
        </Modal>
      </div>
        <Grid columns={2} relaxed textAlign='center' divided='vertically' style={{padding: '30px'}}>
          <Grid.Row>
            <Grid.Column width={10}>
              <Container text>
                <Segment raised>
                  <Header as='h2'>Kevin Doddy - Fullstack Assassin</Header>
                  <p>Hi I'm Kevin, the Fullstack Assassin...</p>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column width={6}>
              <Image src='images/code_assassin.jpg' size='medium' bordered />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={6}>
              <Image src='images/ninja-coder.png' size='medium' bordered style={{marginLeft: '100px'}} />
            </Grid.Column>
            <Grid.Column width={10}>
              <Container text>
                <Segment raised>
                  <Header as='h2'>Habib Qureshi - Backend Ninja</Header>
                  <p>Hi I'm Habib, the Backend Ninja...</p>
                </Segment>
              </Container>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column width={10}>
              <Container text>
                <Segment raised>
                  <Header as='h2'>Kyle McLeod - Frontend Wizard</Header>
                  <p>Hi I'm Kyle, the Frontend Wizard...</p>
                </Segment>
              </Container>
            </Grid.Column>
            <Grid.Column width={6}>
              <Image src='images/code_wizard.png' size='medium' bordered />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Home;