import React from "react";
import $ from 'jquery';
import { Modal, Button, Header, Icon, List } from "semantic-ui-react";

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
    return (
      <li>{!this.state.didUpvote &&
        <button onClick={this.handleUpvote}>
          ^^      
        </button>
        }
        {!this.state.didDownvote &&
        <button onClick={this.handleDownvote}>
          vv     
        </button>
        }
        Rating: {this.state.totalRating}
        Solved by: {this.props.solution.solvedBy}
        Solution: {this.props.solution.masterUserSolutionCode}
        Date: {this.props.solution.createdAt}
      </li>
    )
  }
};

export default SolutionListEntry;