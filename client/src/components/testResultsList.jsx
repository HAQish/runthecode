import React from 'react';
import {Header, Icon, List} from 'semantic-ui-react';

const TestResultsList = (props) => {
  var description = JSON.parse(props.description.replace(/\'+/g,"\""));
    if (props.val) { return (
      <List.Item>
        <List.Icon name='checkmark' color='green' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header style={{color:"white"}}>{description[props.i]} </List.Header>
        </List.Content>
      </List.Item>
    )
    } else { 
      return (
      <List.Item>
        <List.Icon name='remove' color='red' size='large' verticalAlign='middle' />
        <List.Content>
          <List.Header style={{color:"white"}}>{description[props.i]}</List.Header>
        </List.Content>
      </List.Item>
    )
  }
};

export default TestResultsList;