import React from 'react';
import { Form, Menu, Button, Input } from 'semantic-ui-react';

const Login = (props) => {
  return(
    <Menu.Item style={{padding: '0px'}}>
      <Form size='mini'>
        <Form.Group inline widths='equal' style={{margin: '0px'}}>
          <Button type='button' size='small' type='submit' onClick={props.change}>Login</Button>
          <Form.Field control='input' type='email' name='email' placeholder='Email' onChange={props.handleChange} />
          <Form.Field control='input' type='password' name='password' placeholder='Password' onChange={props.handleChange} />
        </Form.Group>
      </Form>
    </Menu.Item>
  )
}

export default Login;