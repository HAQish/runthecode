import React from 'react';
import { Modal, Button, Header, Icon } from 'semantic-ui-react';

const Failure = (props) => {
  return(
    <React.Fragment>
    <Modal.Content>
      <Modal.Description>
        <Header inverted>Sorry, you failed some tests. Please try harder!</Header>
      </Modal.Description>
    </Modal.Content>
    <Modal.Actions>
      <Button color='red' onClick={props.closeTestModal}>
        <Icon name='arrow left' /> Next Problem
      </Button>
    </Modal.Actions>
    </React.Fragment>
  )
}

export default Failure;