import React from 'react';
import {Modal, Button, Header, Icon} from 'semantic-ui-react';

const completedInitialModal = (props) => {
  return(
    <React.Fragment>
    <Modal.Content>
      <Modal.Description>
        <Header inverted>Congrats! You have completed the initial Challenges.</Header>
        <Header inverted>You are now level: {props.level}</Header>
        <Header inverted>Recommended course level: {props.level}</Header>
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions >
      <Button color='green' onClick={props.nextChallenge}>
        Next Challenge
        <Icon name='arrow right' />
      </Button>
    </Modal.Actions>
    </React.Fragment>
  )
}

export default completedInitialModal;