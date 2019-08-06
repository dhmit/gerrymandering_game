import React from 'react';
import './App.css';
import Button from 'react-bootstrap/Button'

class Square extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            district: props.district, // increases by 1 every click
            populations: props.populations, // list of integers representing population of each
            // type of group within this square, respectively
        };
    }

    render() {
        // display a square with population distributions written over as text
        // on click, changes color to indicate changed district
        return null;
    }

}

function Person(props) {
    const circle_style = { // Can be changed as needed
        display: 'inline-block',
        backgroundColor: props.color, // Color of person determined by prop
        borderRadius: '50%',
        width: '10%',
        height: '10%',
    };

    return (
        <div className='person' style={circle_style} /> // Each 'person' is a circle loaded into another div (location?)
    );
}


class Map extends React.Component {
    constructor(props) {
        super(props);

        // set up squares
        const squares = [];
        for (let i = 0; i < props.numSquares; i++) {
            let populations = [];
            for (let p = 0; p < props.numPopulations; p++) {
                populations.push(Math.round(10*Math.random()));
            }
            squares.push({district: 0, populations: populations});
        }

        this.state = {
            numDistricts: props.numDistricts,
            numPopulations: props.numPopulations,
            numSquares: props.numSquares,
            squares: squares, // each square in the list is {district: int, populations: []}
        };
    }

    render() {
        const viewSquares = this.state.squares.map(square =>
            <Square district={square.district} populations={square.populations}/>
        );
        
        return (
            <div>
                {viewSquares}
            </div>
        );
    }
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game_mode: 'single',
            population: 100,
            groups: 2,
        }
    }

    render() {
        return (
            <div className='game'>
                <div className='map-view'>
                    <Map numSquares={this.state.population} numPopulations={this.state.groups} />
                </div>
                <div className='control-view'>
                    <Button variant='primary' size='lg'>Hello</Button>
                </div>
            </div>
        );
    }
}

export default Game;
