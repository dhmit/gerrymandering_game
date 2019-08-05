import React from 'react';
import './App.css';

class Square extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numDistricts: props.numDistricts,
            numPopulations: props.numPopulations,
            district: 0, // increases by 1 every click
        };
    }
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
