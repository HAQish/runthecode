import React from 'react';
import {Grid, Button, Icon, Label} from 'semantic-ui-react';

const AllChallengesListItem = (props) => {
  const {challenge, user} = props;
  const labelColor = '';
  if (challenge.level === 1) {
    labelColor = 'teal';
  } else if (challenge.level === 2 || challenge.level === 3) {
    labelColor = 'yellow';
  } else {
    labelColor = 'red';
  }
  const showSolutions = '';
  if (user.completedChallenges.indexOf(challenge.name) !== -1) {
    showSolutions = (<Button animated='vertical'>
      <Button.Content hidden>Solutions</Button.Content>
      <Button.Content visible>
        <Icon name='puzzle' color='green' />
      </Button.Content>
    </Button>)
  } else {
    showSolutions = <Icon name='remove' color='red' />;
  }
  return <Grid.Row key={challenge.name}>
      <Grid.Column width={10}>
        <Link to=`/allchallenges/${challenge.name}`>{challenge.name}</Link>
      </Grid.Column>
      <Grid.Column width={2}>
        <Label color={color}>{challenge.level}</Label>
      </Grid.Column>
      <Grid.Column width={2}>{showSolutions}</Grid.Column>
      <Grid.Column width={2}>
        <Label color="blue" tag>
          {challenge.ranking}
        </Label>
      </Grid.Column>
    </Grid.Row>;
}

export default AllChallengesListItem;