import React from 'react';
import Editor from './editor.jsx';
import SidebarProblems from './sidebar.jsx';
import { Button, Header, Icon, Card, Image, List } from 'semantic-ui-react';
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
      <div className='homepage banner'>
        <Header as='h1' icon inverted textAlign='center' style={{paddingTop: '20px'}}>
          <Icon name='code' size='small' circular inverted />
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
        {/* <SidebarProblems /> */}
      </div>
    )
  }
}

export default Home;