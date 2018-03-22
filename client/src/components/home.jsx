import React from 'react';
import Editor from './editor.jsx';
import { Button, Header, Icon, Card, Image, List, Grid } from 'semantic-ui-react';
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
        challengeName: "Hello World!"
      },
      masterSolutionCode: "function helloWorld() { \n const hello = ''; \n const world = ''; \n ______ hello + ' ' + world; \n }",
    }
    this.onChange = this.onChange.bind(this);
    this.onSubmitToServer = this.onSubmitToServer.bind(this);
  }

  onChange(e) {
    this.setState({masterSolutionCode: e});
  }

  onSubmitToServer(e) {
    e.preventDefault();
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
        data = JSON.parse(data);
        console.log('✋ Success!', data)
        if (data.message === 'Error') {
          // tell them they have an error
          // data.masterTestResults
        }
      },
      error: err => console.log(err)
    });
  }

  render() {
    const { prompt, challengeName, masterTestDescriptions } = this.state.starterChallenge;
    const { masterSolutionCode } = this.state;
    return(
      <div>
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
          <Button onClick={this.onSubmitToServer} content='Start your journey' />
          </div>
        </div>
      </div>
        <Grid columns={2} centered relaxed textAlign='center' divided='vertically'>
          <Grid.Row>
            <Grid.Column>
            Kevin Doddy - FullStack assassin
            </Grid.Column>
            <Grid.Column>
              <Image src='images/code_assassin.jpg' size='medium' bordered />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Image src='images/ninja-coder.png' size='medium' bordered />
            </Grid.Column>
            <Grid.Column>
            Habib Qureshi - Backend Ninja
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
            Kyle McLeod - Frontend Wizard
            </Grid.Column>
            <Grid.Column>
              <Image src='images/code_wizard.png' size='medium' bordered />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </div>
    )
  }
}

export default Home;