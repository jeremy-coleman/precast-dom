import React, { Component } from 'react';
import PropTypes from 'prop-types'

export const CIRCLE_ID_PREFIX = 'circle-';

export class Circle extends Component {

    render() {
        var isHovered = this.props.hovered,
            shouldShowLine = isHovered || this.props.selected,
            config = {
                cx: this.props.x,
                cy: this.props.y,
                r: this.props.r,
                fill: this.props.color,
                strokeWidth: shouldShowLine ? 5 : 0,
                stroke: isHovered ? this.props.strokeColorHovered : this.props.strokeColorSelected
            };

        return (
            <circle {...config}
                id={this.props.id} />
        );
    }
}

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