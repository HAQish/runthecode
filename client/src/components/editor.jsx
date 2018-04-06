import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';
import { Link } from 'react-router-dom';
import PairingEditor from "./pairingEditor.jsx";

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import { Grid, Button } from 'semantic-ui-react';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUserSolutionCode: this.props.starterCode,
      challengeResults: [],
      destinationUrl: props.destinationUrl
    };
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({
      masterUserSolutionCode: this.props.starterCode
    });
  }
  
  onChange(e) {
    this.setState({ masterUserSolutionCode: e });//|| this.props.starterCode });
  }

  handleSubmit(e) {
    e.preventDefault();
    const {masterTests, displayTestResults, difficulty, challengeName} = this.props;
    const {masterUserSolutionCode} = this.state;
    $.ajax({
      type: "POST",
      url: this.state.destinationUrl,
      data: {
        masterUserSolutionCode: masterUserSolutionCode,
        masterTests: masterTests,
        challengeLevel: this.props.challengeLevel,
        challengeName: challengeName
      },
      success: data => {
        displayTestResults(data, masterUserSolutionCode);
        this.setState({masterUserSolutionCode: ''})
      },
      error: err => console.log(err)
    });
  }  

  render() {
    let pair = (window.location.href.split("/")[3] === "course") ? <br /> : <Button as={Link} to={`/pairing/${this.props.challengeName}/${this.props.socket.id}`} content="Try Pair Programming" />;
    return (
      <div>
        <AceEditor 
        mode="javascript" 
        theme="kuroir" 
        onChange={this.onChange} 
        value={this.state.masterUserSolutionCode || this.props.starterCode} 
        editorProps={{ $blockScrolling: true }} 
        width="100%" height="60vh" 
        />
        <Button onClick={this.handleSubmit} content="Send to server" primary />
        {pair}
        {/* <Button as={Link} to={`/pairing/${this.props.challengeName}/${this.props.socket.id}`} content="Try Pair Programming" /> */}
        {/* <Button onClick={this.props.switch} content="Switch to pair programming" /> */}
      </div>
    );
  }
}

export default Editor;