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
      code: '',
    };
    this.onChange = this.onChange.bind(this);
  }
  
  onChange(e) {
    this.setState({ code: e });
  }

  onClick(e) {
    $.ajax({
      type: "POST",
      url: "/code",
      data: {
        code: this.state.code
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
          value={this.state.code}
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