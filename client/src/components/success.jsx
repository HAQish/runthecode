import React from 'react';
import {Modal, Button, Header, Icon} from 'semantic-ui-react';

const Success = (props) => {
  return(
    <React.Fragment>
    <Modal.Content>
      <Modal.Description>
        <Header inverted>Congrats! You passed all tests!</Header>
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

export default Success;