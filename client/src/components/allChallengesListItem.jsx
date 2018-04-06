import React from 'react';
import {Grid, Button, Icon, Label} from 'semantic-ui-react';
import { Link } from "react-router-dom";

const AllChallengesListItem = (props) => {
  const { challenge, user, index, compChallengeNames } = props;
  let level = Number(challenge.challengeLevel);
  let labelColor;
  if (level < 8) {
    labelColor = 'teal';
  } else if (level >= 8 && level < 12) {
    labelColor = 'yellow';
  } else {
    labelColor = 'red';
  }
  let showSolutions;
  if (compChallengeNames.indexOf(challenge.challengeName) !== -1) {
    showSolutions = <Link to={`/solutions/${challenge.challengeName}`}><Icon name="puzzle" color="green" size="big" /></Link>;
  } else {
    showSolutions = <Icon name='remove' color='red' size='big' />;
  }
  return <Grid.Row className="list-view">
      <Grid.Column width={8}>
        <Link to={`/allchallenges/${challenge.challengeName}`}>
          <h3>{challenge.challengeName}</h3>
        </Link>
      </Grid.Column>
      <Grid.Column width={2}>
        <Label color={labelColor}>{challenge.challengeLevel}</Label>
      </Grid.Column>
      <Grid.Column width={2}>{showSolutions}</Grid.Column>
      <Grid.Column width={2}>
        <Label color="blue" tag>
          {/* {challenge.ranking} */}
          {challenge.createdBy}
        </Label>
      </Grid.Column>
    </Grid.Row>;
}

export default AllChallengesListItem;