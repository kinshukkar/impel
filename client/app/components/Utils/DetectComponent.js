import React from 'react';

export const isClassComponent = (component) => {
  return (
    typeof component === 'function' && !!component.prototype.isReactComponent
  );
};

export const isFunctionComponent = (component) => {
  return (
    typeof component === 'function' && String(component).includes('return React.createElement')
  );
};

export const isReactComponent = (component) => {
  return (
    isClassComponent(component) || isFunctionComponent(component)
  );
};

export const isElement = (element) => React.isValidElement(element);

export const isDOMTypeElement = (element) => {
  return isElement(element) && typeof element.type === 'string';
};

export const isCompositeTypeElement = (element) => {
  return isElement(element) && typeof element.type === 'function';
};

/* USAGE
link: https://stackoverflow.com/questions/33199959/how-to-detect-a-react-component-vs-a-react-element

// CLASS BASED COMPONENT
class Foo extends React.Component {
  render(){
      return <h1>Hello</h1>;
  }
}

const foo = <Foo />;

//FUNCTIONAL COMPONENT
function Bar (props) { return <h1>World</h1> }
const bar = <Bar />;

// REACT ELEMENT
const header = <h1>Title</h1>;

// CHECK
isReactComponent(Foo); // true
isClassComponent(Foo); // true
isFunctionComponent(Foo); // false
isElement(Foo); // false

isReactComponent(<Foo />) // false
isElement(<Foo />) // true
isDOMTypeElement(<Foo />) // false
isCompositeTypeElement(<Foo />) // true

isReactComponent(Bar); // true
isClassComponent(Bar); // false
isFunctionComponent(Bar); // true
isElement(Bar); // false

isReactComponent(<Bar />) // false
isElement(<Bar />) // true
isDOMTypeElement(<Bar />) // false
isCompositeTypeElement(<Bar />) // true
*/
