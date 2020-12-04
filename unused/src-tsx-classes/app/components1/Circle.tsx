import PropTypes from 'prop-types';
import React from 'react';

export const CIRCLE_ID_PREFIX = 'circle-';

export const Circle = (props) => {
  var isHovered = props.hovered,
      shouldShowLine = isHovered || props.selected,
      config = {
    cx: props.x,
    cy: props.y,
    r: props.r,
    fill: props.color,
    strokeWidth: shouldShowLine ? 5 : 0,
    stroke: isHovered ? props.strokeColorHovered : props.strokeColorSelected
  };
  return <circle {...config} id={props.id} />;
};

Circle.propTypes = {
    id: PropTypes.string.isRequired,
    strokeColorSelected: PropTypes.string,
    strokeColorHovered: PropTypes.string,
    selected: PropTypes.bool,
    hovered: PropTypes.bool
};

Circle.defaultProps = {
    strokeColorSelected: 'white',
    strokeColorHovered: 'white',
    selected: false,
    hovered: false
};