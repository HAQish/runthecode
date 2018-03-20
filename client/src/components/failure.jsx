import React from 'react';
import { Modal, Button, Header, Icon, List } from 'semantic-ui-react';

const Failure = (props) => {
  const testList = props.currentTestResults.map((value, i) => {
    if (value) {
      <List.Item>
        <List.Icon name='checkmark' color='green' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>PASSED: {props.masterTestDescriptions[i]}</List.Header>
        </List.Content>
      </List.Item>
    } else {
      <List.Item>
        <List.Icon name='remove' color='red' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header>FAILED: {props.masterTestDescriptions[i]}</List.Header>
        </List.Content>
      </List.Item>
    }
  });
  return(
    <React.Fragment>
    <Modal.Content>
      <Modal.Description>
        <Header inverted>Sorry, you failed some tests. Please try harder!</Header>
        <List divided relaxed>
          {testList}
        </List>
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