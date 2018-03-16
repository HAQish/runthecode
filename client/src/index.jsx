import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import Challenge from './components/challenge.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';

import { Grid, Button } from 'semantic-ui-react';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      user: {},
      // currentUserSolutionCode: '',
      // Global state needed:
      // email
      // level
      // XP
      // Points
      // current challenge
      // global ranking
    };
    this.logout = this.logout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.clearState = this.clearState.bind(this);
  }

  // onChange(e) {
  //   this.setState({currentUserSolutionCode: e});
  // }

  // onClick(e) {
  //   $.ajax({
  //     type: "POST",
  //     url: "/challengeSolution",
  //     data: {
  //       currentUserSolutionCode: this.state.currentUserSolutionCode
  //     }
  //   })
  // }

  // testPostUser(e) {
  //   $.ajax({
  //     type: "POST",
  //     url: "/createUser",
  //     data: {
  //       username: "testUser1",
  //       password: "testUser1",
  //       email: "testUser1",
  //       level: "01",
  //       experience: "01",
  //       score: "01"
  //     }
  //   })
  // }

  // testPostChallenge(e) {
  //   $.ajax({
  //     type: "POST",
  //     url: "/createChallenge",
  //     data: {
  //       challengeName: "testChallenge1",
  //       createdBy: "testChallenge1",
  //       categories: ["testChallenge1"],
  //       prompt: "testChallenge1",
  //       exampleTests: ["testChallenge1"],
  //       finalTests: ["testChallenge1"],
  //       resources: [{
  //         resourceName: "testChallenge1",
  //         resourceUrl: "testChallenge1"
  //       }],
  //       hints: [{
  //         text: "testChallenge1",
  //         deductionValue: "01"
  //       }],
  //       masterSolution: "testChallenge1",
  //       maxScore: "01",
  //       difficulty: "01"
  //     }
  //   })
  // }

  // testPostSolution(e) {
  //   $.ajax({
  //     type: "POST",
  //     url: "/addSolution",
  //     data: {
  //       challengeName: "testSolution1",
  //       prompt: "testSolution1",
  //       createdBy: "testSolution1",
  //       solvedBy: "testSolution1",
  //       score: "01",
  //       rating: "01",
  //       code: "testSolution1",
  //       comments: [{
  //         user: "testSolution1",
  //         comment: "testSolution1"
  //       }]
  //     }
  //   })
  // }

  // populateUser(e) {
  //   $.ajax({
  //     type: "GET",
  //     url: "/populatedUser"
  //   })
  // }

  // populateChallenge(e) {
  //   $.ajax({
  //     type: "GET",
  //     url: "/populatedChallenge"
  //   })
  // }
      // <div>
      //     <AceEditor
      //       mode='javascript'
      //       theme="kuroir"
      //       onChange={this.onChange.bind(this)}
      //       value={this.state.currentUserSolutionCode}
      //       editorProps={{$blockScrolling: true}}
      //       width='100%'
      //       height='95vh'
      //     />
      //     <div>
      //       <button onClick={this.onClick.bind(this)}> Send code to server </button> <br />
      //       <button onClick={this.testPostUser.bind(this)}> Test post user to server </button> <br />
      //       <button onClick={this.testPostChallenge.bind(this)}> Test post challenge to server </button> <br />
      //       <button onClick={this.testPostSolution.bind(this)}> Test post solution to server </button> <br />
      //       <button onClick={this.populateUser.bind(this)}> Populate user </button> <br />
      //       <button onClick={this.populateChallenge.bind(this)}> Populate challenge </button> <br />
      //     </div>

  logout() {
    fetch('/logout')
      .then(data => this.clearState())
      .catch(error => console.log('error', error));
  }

  clearState() {
    this.setState({
      isLoggedIn: false,
      user: {}
    });
  }

  handleLogin(user) {
    this.setState({
      user: user,
      isLoggedIn: true
    });
  }

  render () {
    const loggedIn = this.state.isLoggedIn ? (
      <Challenge />
    ) : (
      <Home />
    )

    return (
      <div>
        <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.isLoggedIn} />
        {loggedIn}
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));









































