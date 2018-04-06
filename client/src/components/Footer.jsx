import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  flex-shrink: 0;
  background-color: #d7edc6;
  justify-content: space-around;#d7edc6
  align-items: center;
  height: 30px;
`;

const Footer = (props) => {
  return(
    <Wrapper>
      <div>&copy; &reg; LevelUP Code 2018</div>
      <div>Kyle McLeod</div>
      <div>Kevin Doddy</div>
      <div>Habib Qureshi</div>
    </Wrapper>
  )
}

export default Footer;