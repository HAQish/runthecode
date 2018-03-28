import React, { Component } from 'react';
import Link from 'react-router-dom';
import $ from 'jquery';

class AllChallenges extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: ''
    }
  }

  componentWillMount() {
    // const {params} = this.props.match.params;
    console.log('parameters', this.props.match.params)
    $.get(`/userSubmittedChallenge/${this.props.match.params.challengeName}`, (data) => {
      this.setState({response: data});
    });
  }

  render(){
    return (
      <div>all challenges component ====== {this.state.response}</div>
    )
  }
}

export default AllChallenges;