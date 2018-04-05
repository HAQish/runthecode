import React from 'react';
import $ from 'jquery';
import {Link} from 'react-router-dom';
import SolutionListEntry from './SolutionListEntry.jsx';
import styled from 'styled-components';
import {
  Modal,
  Button,
  Image,
  Icon,
  Header,
  Grid,
  Segment,
  Container,
  Label,
  Form,
  Card,
  Feed
} from "semantic-ui-react";

export default function SolutionList(props) {

  return(
    //map solutionlistentry
    <div>
      <div>Solutions for {props.challengeName}</div>
      <ul>
        {props.solutions.map((solution) =>
        <SolutionListEntry key={solution.id} solution={solution} />)}
      </ul>
    </div>
  )
};