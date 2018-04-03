import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import styled from 'styled-components';
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

class Solutions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      challenge: ''
    };
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
  };

  componentWillMount() {
    $.get("/solutions/:challengeName", (data) => this.setState({challange: data}))
  }

  handleUpVote(e) {
    let chalName = e.name;
    $.post("/rateSolution", {[chalName]: 1}, (data) => console.log(data));
  };
  handleDownVote(e){
    let chalName = e.name;
    $.post("/rateSolution", {[chalName]: -1}, (data) => console.log(data));
  };

  render() {
    return(
      <div>
      <div>Solutions for </div>
      </div>
    )
  }
}

export default Solutions;