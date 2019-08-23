import React, { Component } from 'react';

const texts = [
    'Click the circle to bring it to the top.',
    'Click the background to create new circle.',
    'Click and drag the circle to move all the circles.',
    'Shift + click = clear screen',
    'Alt + click + mouse move = new circle',
    '"Clear" button removes all the circles.',
    '"New circle" button creates the circle at last click position.'
];

export class TextRotator extends Component {

    constructor(props) {
        super(props);

        this.state = {
            index: 0,
            text: texts[0]
        };

        //this.start();
    }

    // start() {
    //     this.interval = setInterval(
    //         () => {
    //             var index = (this.state.index + 1) % texts.length;

    //             this.setState({
    //                 index,
    //                 text: texts[index]
    //             });
    //         },
    //         2000
    //     );
    // }

    // stop() {
    //     clearInterval(this.interval);
    //     this.interval = null;
    // }

    render() {
        return (
            <span className='wrappy'>{texts.map(t => <p key={t}>{t}</p>)}</span>
        );
    }
}