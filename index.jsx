import * as React from 'react';

/**
  * returns a React class with the given mutator functions applied
  * @param  {React class} ElementClass a class define with React.createClass
  * @param  {function[]} any number of functions to mutate the result of the 
  *                          ElementClass's render function
  * @return {React class}
  */
function mutate(ElementClass /* ...mutators */) {
  var mutators = Array.from(arguments).slice(1);
  var originalRender = ElementClass.prototype.render;

  ElementClass.prototype.render = function() {
    var el = this;

    // Prerenders
    mutators.filter(function(mutator) {
      return mutator.preRender;
    }).map(function(mutator) {
      return mutator.preRender;
    }).forEach(function(mutator) {
      mutator(el);
    });

    var renderedElement = originalRender.call(el);

    mutators.forEach(function(mutator) {
      renderedElement = mutator.call(renderedElement);
    });

    return renderedElement;
  }

  return ElementClass;
}

function elementIsType(element, type) {
  if (!element.type) {
    return false;
  } else if (typeof element.type === 'string') {
    return element.type === type;
  } else if (element.type.displayName) {
    return element.type.displayName === type;
  } else {
    return false;
  }
}

function query(element, type) {
  var results = [];

  if (!element) {
    return results;
  }

  if (elementIsType(element, type)) {
    results.push(element);
  }

  if (element.props && element.props.children) {
    if (Array.isArray(element.props.children)) {
      results = element.props.children.reduce(function(results, child) {
        return results.concat(query(child, type));
      }, results);
    } else {
      results = results.concat(query(element.props.children, type));
    }
  }

  return results;
}

export { mutate, query, elementIsType };
