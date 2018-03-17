import React from 'react';
import AceEditor from 'react-ace';
import brace from 'brace';
import $ from 'jquery';

import 'brace/theme/kuroir';
import 'brace/mode/javascript';

import 'brace/ext/language_tools';
import 'brace/ext/searchbox';

import { Grid, Button } from 'semantic-ui-react';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      masterUserSolutionCode: '',
    };
    this.onChange = this.onChange.bind(this);
  }
  
  onChange(e) {
    this.setState({ masterUserSolutionCode: e });
  }

  onClick(e) {
    $.ajax({
      type: "POST",
      url: "/challengeSolution",
      data: {
        masterUserSolutionCode: this.state.masterUserSolutionCode
      }
    })
  }  

  render() {
    return(
      <div>
        <AceEditor
          mode='javascript'
          theme="kuroir"
          onChange={this.onChange.bind(this)}
          value={this.state.masterUserSolutionCode}
          editorProps={{ $blockScrolling: true }}
          width='100%'
          height='95vh'
        />
        <Button onClick={this.onClick.bind(this)} content="Send to server" primary />
      </div>
    )
  }
}

export default Editor;