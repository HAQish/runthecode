import React from 'react';
import {
  Sidebar,
  Button,
  Menu,
  Image,
  Icon,
  Header,
  Grid,
  Segment,
  Dropdown
} from "semantic-ui-react";

const Side = function (props) {
  const {children} = props;
  const {visible} = props;
  const level1Options = [{ key: 1, text: "Problem 1", value: 1 }, { key: 2, text: "Problem 2", value: 2 }, { key: 3, text: "Problem 3", value: 3 }];
  return ( 
    <Sidebar.Pushable as={Segment} style={{height: "90vh"}}>
      <Sidebar as={Menu} animation="push" width="thin" icon="labeled" vertical visible={visible} inverted>
        <Dropdown icon="chevron down" fluid text="Level 1" direction="right" labeled item simple className="icon" options={level1Options} />
        <Dropdown icon="chevron down" fluid text="Level 2" direction="right" labeled item simple className="icon" options={level1Options} />
        <Dropdown icon="chevron down" fluid text="Level 3" direction="right" labeled item simple className="icon" options={level1Options} />
      </Sidebar>
      <Sidebar.Pusher>{children}</Sidebar.Pusher>
    </Sidebar.Pushable>
  ); 
}

export default Side;