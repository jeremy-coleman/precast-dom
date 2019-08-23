import React from 'react';

export function Svg(props){
    return (
            <svg x={props.top} width={props.width} height={props.height}>
                {props.children}
            </svg>
        );
}