import React from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUserSolutionCode: '',
    };
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    this.setState({currentUserSolutionCode: e});
  }

  onClick(e) {
    $.ajax({
      type: "POST",
      url: "/challengeSolution",
      data: {
        currentUserSolutionCode: this.state.currentUserSolutionCode
      }
    })
  }

  testPostUser(e) {
    $.ajax({
      type: "POST",
      url: "/createUser",
      data: {
        username: "testUser1",
        password: "testUser1",
        email: "testUser1",
        level: "01",
        experience: "01",
        score: "01"
      }
    })
  }

  testPostChallenge(e) {
    $.ajax({
      type: "POST",
      url: "/createChallenge",
      data: {
        challengeName: "testChallenge1",
        createdBy: "testChallenge1",
        categories: ["testChallenge1"],
        prompt: "testChallenge1",
        exampleTests: ["testChallenge1"],
        finalTests: ["testChallenge1"],
        resources: [{
          resourceName: "testChallenge1",
          resourceUrl: "testChallenge1"
        }],
        hints: [{
          text: "testChallenge1",
          deductionValue: "01"
        }],
        masterSolution: "testChallenge1",
        maxScore: "01",
        difficulty: "01"
      }
    })
  }

  testPostSolution(e) {
    $.ajax({
      type: "POST",
      url: "/addSolution",
      data: {
        challengeName: "testSolution1",
        prompt: "testSolution1",
        createdBy: "testSolution1",
        solvedBy: "testSolution1",
        score: "01",
        rating: "01",
        code: "testSolution1",
        comments: [{
          user: "testSolution1",
          comment: "testSolution1"
        }]
      }
    })
  }

  populateUser(e) {
    $.ajax({
      type: "GET",
      url: "/populatedUser"
    })
  }

  populateChallenge(e) {
    $.ajax({
      type: "GET",
      url: "/populatedChallenge"
    })
  }

    render () {
    return (
      <div>
          <AceEditor
            mode='javascript'
            theme="kuroir"
            onChange={this.onChange.bind(this)}
            value={this.state.currentUserSolutionCode}
            editorProps={{$blockScrolling: true}}
            width='100%'
            height='95vh'
          />
          <div>
            <button onClick={this.onClick.bind(this)}> Send code to server </button> <br />
            <button onClick={this.testPostUser.bind(this)}> Test post user to server </button> <br />
            <button onClick={this.testPostChallenge.bind(this)}> Test post challenge to server </button> <br />
            <button onClick={this.testPostSolution.bind(this)}> Test post solution to server </button> <br />
            <button onClick={this.populateUser.bind(this)}> Populate user </button> <br />
            <button onClick={this.populateChallenge.bind(this)}> Populate challenge </button> <br />
          </div>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));









































