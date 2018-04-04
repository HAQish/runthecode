import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  background-color: #4CBB6B;
  justify-content: space-around;
  align-items: center;
  height: 70px;
`;

const Footer = (props) => {
  return(
    <Wrapper>
      <div>First box</div>
      <div>Second box</div>
      <div>Third box</div>
    </Wrapper>
  )
}

export default Footer;