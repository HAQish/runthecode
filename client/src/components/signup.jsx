import React from 'react';
import { Button, Form, Segment } from 'semantic-ui-react';
import $ from 'jquery';

class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      username: '',
      data: null
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    const { email, password, username } = this.state;
    const {handleLogin} = this.props;
    let user = {
      local: {
        email: email,
        password: password
      },
      username: username
    }
    console.log('😇😇😇😇😇😇😇😇', user);
    $.ajax({
      type: 'POST',
      url: '/signup',
      data: user,
      success: (data) => {
        console.log('😎', data);
        this.setState({
          email: data.username,
          password: data.password
        });
        handleLogin(data);
      },
      error: (data) => {
        console.log('😈', data);
      }
    })
  }
  
  handleChange(e, {name, value}) {
    this.setState({
      [name]: value
    });
  }

  render() {
    const { email, password, username } = this.state;
    return (
      <Segment inverted>
        <Form inverted>
          <Form.Group widths='equal'>
            <Form.Input fluid type='email' name='email' label='Email' placeholder='email@email.com' value={email} onChange={this.handleChange} />
            <Form.Input fluid type='password' name='password' label='Password' placeholder='Password' value={password} onChange={this.handleChange} />
          </Form.Group> 
          <Form.Input fluid label='Pick a Username' name='username' placeholder='Username' value={username} onChange={this.handleChange.bind(this)} />
          <Form.Button onClick={this.handleSubmit} type='submit'>Submit</Form.Button>
        </Form>
      </Segment>
    )
  }
}
export default Signup;
