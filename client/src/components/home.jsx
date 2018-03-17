import React from 'react';
import { Button, Header, Icon } from 'semantic-ui-react';

const Home = (props) => {
  
  return(
    <div>
      <Header as='h1' icon textAlign='center'>
        <Icon name='code' size='small' circular inverted />
        <Header.Content>
          LevelUP Code
        </Header.Content>
      </Header>
      
    </div>
  )
}

export default Home;