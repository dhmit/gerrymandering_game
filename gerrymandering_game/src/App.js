import React from 'react';
import './App.css';
import Col from 'react-bootstrap/Col';
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

        let column1, column2, column3;
        const third = Math.round(viewSquares.length / 3);
        if (viewSquares.length % 3 === 0) {
            column1 = viewSquares.slice(0, third);
            column2 = viewSquares.slice(third, 2*third);
            column3 = viewSquares.slice(2*third, 3*third);
        } else if (viewSquares.length % 3 === 1) {
            column1 = viewSquares.slice(0, third+1);
            column2 = viewSquares.slice(third+1, 2*third+1);
            column3 = viewSquares.slice(2*third+1, 3*third+1);
        } else {
            column1 = viewSquares.slice(0, third+1);
            column2 = viewSquares.slice(third+1, 2*third+2);
            column3 = viewSquares.slice(2*third+2, 3*third+2);
        }
        
        return (
            <div>
                <Col>{column1}</Col>
                <Col>{column2}</Col>
                <Col>{column3}</Col>
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
