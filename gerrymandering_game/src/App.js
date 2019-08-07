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

    boxClick = () => { 
        const colors = ['red', 'blue', 'yellow', 'green', 'purple'];
        const district = (this.state.district+1) % this.state.populations.length;
        this.setState({
            district: district,
            bgColor: colors[district],
        });
    };

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

        return (
            <div>{viewSquares}</div>
        );
    }
}

function InputWarning(props) {
    if (!props.show) {
        return null;
    } else {
        return (
            <Alert variant='danger' className='input-warning'>
                Please only use integer values
            </Alert>
        );

    }
}

function GameSettings(props) {
    return (
        <div>
            <ToggleButtonGroup type='radio' value={props.game_mode} onChange={props.modeChange} name='game-mode'>
                <ToggleButton value='single' variant='outline-dark'>Single Member</ToggleButton>
                <ToggleButton value='proportional' variant='outline-dark'>Proportional</ToggleButton>
            </ToggleButtonGroup>
            <Form onSubmit={props.formSubmit} >
                <Form.Group controlId='population'>
                    <Form.Label>Population</Form.Label>
                    <Form.Control type='text' value={props.population} onChange={props.numberChange}/>
                </Form.Group>
                <Form.Group controlId='areas'>
                    <Form.Label>Areas</Form.Label>
                    <Form.Control type='text' value={props.areas} onChange={props.numberChange}/>
                </Form.Group>
                <Form.Group controlId='groups'>
                    <Form.Label>Groups</Form.Label>
                    <Form.Control type='text' value={props.groups} onChange={props.numberChange}/>
                </Form.Group>
                <Button type='submit' variant='outline-secondary'>Refresh</Button>
            </Form>
            <InputWarning show={props.raise_warning}/>
        </div>
    );
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            game_mode: 'single',
            population: 10,
            groups: 2,
            areas: 10,
            user_areas: 10,
            user_population: 10,
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
        const user_areas = this.state.user_areas;

        if (isNaN(user_population) || isNaN(user_groups) || isNaN(user_areas)) {
            this.setState({
                raise_warning: true,
            });
        } else {

            this.setState({
                population: +user_population,
                groups: +user_groups,
                areas: +user_areas,
                user_groups,
                user_population,
                user_areas,
                raise_warning: false,
            });
        }
    }

    gameNumberChange(e) {
        if (e.target.id === 'groups') { // User changed groups
            this.setState({
                user_groups: e.target.value,
            });
        } else if (e.target.id === 'areas') {
            this.setState({
                user_areas: e.target.value,
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
                        <Map
                            numSquares={this.state.areas}
                            numPopulations={this.state.groups}
                            population={this.state.population}
                        />
                    </Col>
                    <Col sm='4' xs='6'>
                        <GameSettings
                            game_mode={this.state.game_mode}
                            modeChange={(e) => this.gameModeChange(e)}
                            formSubmit={(e) => this.gameNumberSubmit(e)}
                            numberChange={(e) => this.gameNumberChange(e)}
                            population={this.state.user_population}
                            areas={this.state.user_areas}
                            groups={this.state.user_groups}
                            raise_warning={this.state.raise_warning}
                        />
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Game;
