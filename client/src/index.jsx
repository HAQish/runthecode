import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';
import { BrowserRouter, Route } from 'react-router-dom';
import Challenge from './components/challenge.jsx';
import Navbar from './components/navbar.jsx';
import Home from './components/home.jsx';
import Dashboard from './components/dashboard.jsx';
import Side from './components/side.jsx';
import AllChallenges from './components/allChallenges.jsx';
import UserChallenges from "./components/UserChallenges.jsx";
import { Sidebar, Button, Menu, Image, Icon, Header, Grid, Segment, Dropdown } from 'semantic-ui-react';
import styled from 'styled-components';

const Footer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 1;
  background-color: #4CBB6B;
  justify-content: space-around;
  align-items: center;
  height: 70px;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // isLoggedIn: false, //false?render <Home>...true?render logout button and <Challenge>...set to true on login/signup
      masterUser: undefined, //{"local":{"email":"fakeemail@yahoo.com","password":"fakepw"},"completedInitial":false,"completedChallenges":[],"_id":"5ab5358921b7e547a81fcc3e","createdAt":"2018-03-23T17:12:41.095Z","username":"fakeusername","__v":0}
      visible: false
    };
    this.logout = this.logout.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.clearState = this.clearState.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
    this.handleInitialComplete = this.handleInitialComplete.bind(this);
  }

  componentWillMount() {
    // check if user is logged in
    // if so, set user on state
    $.get('/isLoggedIn', data => {
      console.log('🌴', data);
      if (data !== undefined) {
        this.setState({
          masterUser: data
        });
      } else {
        this.setState({
          masterUser: undefined
        });
      }
    });
    console.log('🤡🤡🤡🤡🤡🤡', this.state.masterUser);
  }

  toggleVisibility() {
    this.setState({visible: !this.state.visible});
  }

  logout() {
    $.ajax({
      type: "GET",
      url: "/logout",
      success: (data) => {this.clearState()},
      failure: (err => console.log("error in logout in app", err))
    })
    // fetch('/logout', {credentials: 'include'})
    //   .then(data => this.clearState())
    //   .catch(error => console.log('error', error));
  }

  clearState() {
    this.setState({
      masterUser: undefined
    });
  }

  handleLogin(user) {
    console.log('😇', user);
    this.setState({
      masterUser: user[0],
    });
    console.log(this.state.masterUser);
  }
  
  handleInitialComplete(score) {
    $.post("/initialChallenges", {user: this.state.masterUser, initialScore: score}, (data) => {console.log('DATA IN HANDLE INITIAL COMPLETE -> ', data); this.setState({masterUser: data})})
  }

  render () {
    const {visible} = this.state;
    const loggedIn = this.state.masterUser ? 
    (<Route exact path="/" component={() => <Dashboard user={this.state.masterUser} />} />) 
    : 
    (<Route exact path="/" component={() => <Home handleLogin={this.handleLogin} />} />);

    return(
      <BrowserRouter>
        <div>
          <div>
            <Side visible={this.state.visible}>
              <Navbar handleLogin={this.handleLogin} logout={this.logout} isLoggedIn={this.state.masterUser} toggleSidebar={this.toggleVisibility} />
              {loggedIn}
              <Route path="/course" component={() => <Challenge initialComplete={this.handleInitialComplete} user={this.state.masterUser}/>} />
              <Route exact path="/allchallenges" component={AllChallenges} />
              <Route path="/allchallenges/:challengeName" component={UserChallenges} />
              {/* <Route path="/challenges" component={() => <UserChallenges initialComplete={this.handleInitialComplete} user={this.state.masterUser} />} /> */}
              <Footer style={{marginTop: '40px'}}>
                <div>First box</div>
                <div>Second box</div>
                <div>Third box</div>
              </Footer>
            </Side>
          </div>
        </div>
      </BrowserRouter>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));







































