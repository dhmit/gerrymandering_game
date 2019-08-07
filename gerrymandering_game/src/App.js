import React from 'react';
import './App.css';
import ToggleButtonGroup from "react-bootstrap/ToggleButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert'
import {Rectangle} from 'react-shapes';


class Square extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            district: props.district, // increases by 1 every click
            populations: props.populations, // list of integers representing population of each
            // type of group within this square, respectively
            bgColor: '#ffffff'
        };
    }

    boxClick = (e) => {
        this.setState({
            bgColor: "red"
        })
    }

    render() {
        // display a square with population represented as person/circles
        // on click, changes color to indicate changed district
        return (
            <Rectangle
                width={100}
                height={100}
                fill={{color: this.state.bgColor}}
                stroke={{color:'#000000'}}
                strokeWidth={3}
                onClick={this.boxClick}
            />
        );
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

function InputWarning(props) {
    if (!props.show) {
        return null;
    } else {
        return (
            <Alert variant='danger'>
                Please only use integer values
            </Alert>
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
            user_population: 100,
            user_groups: 2,
            raise_warning: false,
        }
    }

    gameModeChange(val) {
        this.setState({
            game_mode: val,
        });
    }

    gameNumberSubmit(e) {
        e.preventDefault();
        const user_population = this.state.user_population;
        const user_groups = this.state.user_groups;

        if (isNaN(user_population) || isNaN(user_groups)) {
            this.setState({
                raise_warning: true,
            });
        } else {

            this.setState({
                population: +user_population,
                groups: +user_groups,
                user_groups,
                user_population,
                raise_warning: false,
            });
        }
    }

    gameNumberChange(e) {
        if (e.target.id === 'groups') { // User changed groups
            this.setState({
                user_groups: e.target.value,
            });
        } else if (e.target.id === 'population') { // User changed population
            this.setState({
                user_population: e.target.value,
            });
        } else { // The user broke the system in a non-crashy way
            console.log(e.target.id);
        }
    }

    render() {
        return (
            <Container className='game'>
                <Row>
                    <Col sm='8' xs='6'>
                        <Map numSquares={this.state.population} numPopulations={this.state.groups} />
                    </Col>
                    <Col sm='4' xs='6'>
                        <ToggleButtonGroup type='radio' value={this.state.game_mode} onChange={e => this.gameModeChange(e)} name='game-mode'>
                            <ToggleButton value='single' variant='outline-dark'>Single Member</ToggleButton>
                            <ToggleButton value='proportional' variant='outline-dark'>Proportional</ToggleButton>
                        </ToggleButtonGroup>
                        <Form onSubmit={(e) => this.gameNumberSubmit(e)} >
                            <Form.Group controlId='population'>
                                <Form.Label>Population</Form.Label>
                                <Form.Control type='text' value={this.state.user_population} onChange={(e) => this.gameNumberChange(e)}/>
                            </Form.Group>
                            <Form.Group controlId='groups'>
                                <Form.Label>Groups</Form.Label>
                                <Form.Control type='text' value={this.state.user_groups} onChange={(e) => this.gameNumberChange(e)}/>
                            </Form.Group>
                            <Button type='submit' variant='outline-secondary'>Refresh</Button>
                        </Form>
                        <InputWarning show={this.state.raise_warning}/>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Game;
