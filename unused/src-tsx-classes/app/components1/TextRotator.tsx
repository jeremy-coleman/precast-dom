import React from 'react';

const texts = [
    'Click the circle to bring it to the top.',
    'Click the background to create new circle.',
    'Click and drag the circle to move all the circles.',
    'Shift + click = clear screen',
    'Alt + click + mouse move = new circle',
    '"Clear" button removes all the circles.',
    '"New circle" button creates the circle at last click position.'
];

export const TextRotator = () => {
    return <span className='wrappy'>{texts.map(t => <p key={t}>{t}</p>)}</span>
    }
