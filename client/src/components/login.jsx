import React from 'react';
import { Form, Menu, Button, Input } from 'semantic-ui-react';
import $ from 'jquery';

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(e) {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({
      [name]: value
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    const user = {
        username: this.state.email,
        password: this.state.password
    };
    $.post('/login', user, (data) => this.props.handleLogin(data))
    // this.props.handleLogin(user);
  }

  render() {
    return(
      <Menu.Item style={{padding: '0px'}}>
        <Form size='mini'>
          <Form.Group inline widths='equal' style={{margin: '0px'}}>
            <Button type='button' size='small' type='submit' onClick={this.handleSubmit}>Login</Button>
            <Form.Field control='input' type='email' name='email' placeholder='Email' onChange={this.handleInputChange} />
            <Form.Field control='input' type='password' name='password' placeholder='Password' onChange={this.handleInputChange} />
          </Form.Group>
        </Form>
      </Menu.Item>
    )
  }
}

export default Login;