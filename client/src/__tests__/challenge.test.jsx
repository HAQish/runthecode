import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow } from 'enzyme';
import Challenge from '../components/challenge.jsx';


// describe('blah blah')

// snapshot test with renderer
// test('Challenge renders correctly', () => {
//   const component = renderer.create(<Challenge />);
//   const tree = component.toJSON();
//   expect(tree).toMatchSnapshot();
// });

// with enzyme
test('Challenge renders correctly', () => {
  const component = shallow(<Challenge />>);
  expect(component).toMatchSnapshot();
});

