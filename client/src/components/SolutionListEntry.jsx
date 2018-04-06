import React from "react";
import $ from 'jquery';
import { Modal, Button, Header, Icon, List, Grid, Label } from "semantic-ui-react";

const getRating = function(ratings) {
  let sum = 0;
  for (var el in ratings) {
    if (ratings.hasOwnProperty(el)) {
      sum+= Number(ratings[el]);
    }
  }
  return sum;
}

class SolutionListEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      didUpvote: '',
      didDownvote: '',
      totalRating: getRating(this.props.solution.rating)
    };
    this.handleUpvote = this.handleUpvote.bind(this);
    this.handleDownvote = this.handleDownvote.bind(this);
  };

  handleDownvote() {
    this.setState({
      didDownvote: true,
      didUpvote: false,
      totalRating: this.state.totalRating - 1
    });
    let rateObj = {
      challengeName: this.props.solution.challengeName,
      solver: this.props.solution.solvedBy,
      vote: -1
    };
    $.post("/rateSolution", rateObj, (data) => console.log(data));
  };

  handleUpvote() {
    this.setState({
      didUpvote: true,
      didDownvote: false,
      totalRating: this.state.totalRating + 1
    });
    let rateObj = {
      challengeName: this.props.solution.challengeName,
      solver: this.props.solution.solvedBy,
      vote: 1
    };
    $.post("/rateSolution", rateObj, (data) => console.log(data));
  };
    
  render() {
    const created = (new Date(this.props.solution.createdAt).toUTCString());
    return <Grid.Row className="list-view">
        <Grid.Column width={3}>
          {!this.state.didUpvote && <Button color="green" onClick={this.handleUpvote}>
              <Icon name="chevron up" size="large" />
            </Button>}
          {!this.state.didDownvote && <Button color="red" onClick={this.handleDownvote}>
              <Icon name="chevron down" size="large" />
            </Button>}
        </Grid.Column>
        <Grid.Column width={2}>
          <h3>{this.props.solution.solvedBy}</h3>
        </Grid.Column>
        <Grid.Column width={2}>{created}</Grid.Column>
        <Grid.Column width={1}>
          <Label size="large" color="teal">{this.state.totalRating}</Label>
        </Grid.Column>
        <Grid.Column width={8}>
          {this.props.solution.masterUserSolutionCode}
        </Grid.Column>
      </Grid.Row>;
  }
};

export default SolutionListEntry;