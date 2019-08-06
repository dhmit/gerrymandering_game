import React from 'react';
import './App.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        const populations = {};
        let total = 0;
        for (let i = 0; i < props.numPopulations; i++) {
            populations[i] = Math.random();
            total += populations[i];
        }
        for (let i = 0; i < props.numPopulations; i++) {
            populations[i] = 100 * populations[i] / total;
        }

        this.state = {
            numDistricts: props.numDistricts,
            numPopulations: props.numPopulations,
            district: 0, // increases by 1 every click
            populations: populations,
        };
    }

    render() {
        // display a square with population distributions written over as text
        // on click, changes color to indicate changed district
        return null;
    }

}

function Person(props) {
    const circle_style = {
        display: 'inline-block',
        backgroundColor: props.color,
        borderRadius: '50%',
        width: '10%',
        height: '10%',
    };

    return (
        <div className='person' style={circle_style} />
    );
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numDistricts: props.numDistricts,
            numPopulations: props.numPopulations,
        };
    }

    render() {
        return null;
    }
}

export default Game;
