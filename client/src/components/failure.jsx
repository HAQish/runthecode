import React from 'react';
import { Modal, Button, Header, Icon, List } from 'semantic-ui-react';

const Failure = (props) => {
  if (props.message === "Failure") {
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
  }
  return(
    <React.Fragment>
    <Modal.Content>
      <Modal.Description>
        <Header inverted>Sorry, you failed some tests. Please try harder!</Header>
        {props.message === "Failure" &&
        <List divided relaxed>
          {testList}
        </List>
        }
        {props.message === "Error" &&
        <Header inverted>Error: {props.masterTestDescriptions}</Header>
        }
      </Modal.Description>
    </Modal.Content>
    {!props.initialJustCompleted &&
    <Modal.Actions>
      <Button color='red' onClick={props.nextChallenge}>
        <Icon name='arrow right' /> Next Problem
      </Button>
    </Modal.Actions>
    }
    {props.initialJustCompleted && 
      <Button color='green' onClick={props.nextChallenge}>
        Placement Results
        <Icon name='arrow right' />
      </Button>
      }
    </React.Fragment>
  )
}

export default Failure;