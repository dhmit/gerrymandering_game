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


/*
class Square extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            district: props.district, // increases by 1 every click
            populations: props.populations, // list of integers representing population of each
            // type of group within this square, respectively
            bgColor: props.bgColor,
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {
            this.setState({
                populations: this.props.populations,
                district: this.props.district,
                bgColor: this.props.bgColor,
            });
        }
    }

    boxClick = () => { 
        const colors = ['crimson', 'dodgerblue', 'gold', 'mediumseagreen', 'mediumorchid', 'pink', 'orange', 'paleturquoise'];
        const district = (this.state.district+1) % this.state.populations.length;
        this.setState({
            district: district,
            bgColor: colors[district],
        });
    };

    render() {
        const square_style = {
            display: 'inline-block',
            backgroundColor: this.state.bgColor,
            width: 100,
            height: 100,
            border: '1px solid black',
            margin: '2px 2px 2px 2px',
            // onClick: this.boxClick,
        };

        const groupNames = 'ABCDEFGH';
        let squareText = '';
        for (let i = 0; i < this.state.populations.length; i++) {
            squareText += groupNames[i] + ':' + this.state.populations[i] + ' ';
        }

        return (
            <div onClick={this.boxClick} style={square_style}>{squareText}</div>
        );
    }
}
*/

function Square(props) {
    const square_style = {
        display: 'inline-block',
        backgroundColor: props.bgColor,
        width: 100,
        height: 100,
        border: '1px solid black',
        margin: '2px 2px 2px 2px',
        // onClick: this.boxClick,
    };

    const groupNames = 'ABCDEFGH';
    let squareText = '';

    for (let i = 0; i < props.populations.length; i++) {
        squareText += groupNames[i] + ':' + props.populations[i] + ' ';
    }

    return (
        <div onClick={props.boxClick} style={square_style}>{squareText}</div>
    );
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

/*
class Map extends React.PureComponent {
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

    componentDidUpdate(prevProps) {
        if (this.props !== prevProps) {

            const squares = [];

            for (let i = 0; i < this.props.numSquares; i++) {

                let populations = [];
                for (let p = 0; p < this.props.numPopulations; p++) {
                    populations.push(Math.round(10*Math.random()));
                }
                squares.push({district: 0, populations: populations});
            }

            this.setState({
                squares,
            });
        }
    }

    render() {
        const viewSquares = this.state.squares.map(square =>
            <Square district={square.district} populations={square.populations} bgColor='#ffffff'/>
        );

        return (
            <div>{viewSquares}</div>
        );
    }
}
*/

function Map(props) {
    function renderSquare(square, i) {
        return (
            <Square
                district={square.district}
                populations={square.populations}
                bgColor={square.bgColor}
                boxClick={() => props.boxClick(i)}
                key={square.key}
                index={i}
            />
        );
    }
    const viewSquares = props.squares.map((square, index) =>
        renderSquare(square, index)
    );

    return (<div>{viewSquares}</div>);
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

function GameStats(props) {
    return (
        <div>
            <div>Game Stats</div>
        </div>
    );
}

function GameSettings(props) {
    return (
        <div>
            <ToggleButtonGroup type='radio' value={props.game_mode} onChange={props.modeChange} name='game-mode'>
                <ToggleButton value='single' variant='outline-dark'>Single Member</ToggleButton>
                <ToggleButton value='proportional' variant='outline-dark'>Proportional</ToggleButton>
            </ToggleButtonGroup>
            <Form onSubmit={props.formSubmit} >
                <Form.Group controlId='areas'>
                    <Form.Label>Areas</Form.Label>
                    <Form.Control type='number' min={1} value={props.areas} onChange={props.numberChange} required />
                </Form.Group>
                <Form.Group controlId='groups'>
                    <Form.Label>Groups</Form.Label>
                    <Form.Control type='number' min={1} max={8} value={props.groups} onChange={props.numberChange} required/>
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
        const squares = [];
        for (let i = 0; i < 10; i++) {
            let populations = [];
            for (let p = 0; p < 2; p++) {
                populations.push(Math.round(10*Math.random()));
            }
            squares.push({district: 0, populations: populations, bgColor: '#ffffff', key: i});
        }

        this.state = {
            game_mode: 'single',
            groups: 2,
            areas: 10,
            user_areas: 10,
            user_groups: 2,
            raise_warning: false,
            squares: squares,
        };
    }

    boxClick = (i) => {
        const colors = ['crimson', 'dodgerblue', 'gold', 'mediumseagreen', 'mediumorchid', 'pink', 'orange', 'paleturquoise'];
        const district = (this.state.squares[i].district+1) % this.state.squares[i].populations.length;
        let newSquares = this.state.squares.slice();
        newSquares[i].district = district;
        newSquares[i].bgColor = colors[district];
        this.setState({squares: newSquares});
    };

    gameModeChange(val) {
        this.setState({
            game_mode: val,
        });
    }

    gameNumberSubmit(e) {
        e.preventDefault();
        const user_groups = this.state.user_groups;
        const user_areas = this.state.user_areas;

        if (isNaN(user_groups) || isNaN(user_areas)) {
            this.setState({
                raise_warning: true,
            });
        } else {
            const squares = [];

            for (let i = 0; i < user_areas; i++) {

                let populations = [];
                for (let p = 0; p < user_groups; p++) {
                    populations.push(Math.round(10*Math.random()));
                }
                squares.push({district: 0, populations: populations, bgColor: '#ffffff', key: i});
            }

            this.setState({
                groups: +user_groups,
                areas: +user_areas,
                user_groups,
                user_areas,
                raise_warning: false,
                squares: squares,
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
                            squares={this.state.squares}
                            boxClick={(i) => this.boxClick(i)}
                        />
                    </Col>
                    <Col sm='4' xs='6'>
                        <Row>
                            <Col>
                                <GameSettings
                                    game_mode={this.state.game_mode}
                                    modeChange={(e) => this.gameModeChange(e)}
                                    formSubmit={(e) => this.gameNumberSubmit(e)}
                                    numberChange={(e) => this.gameNumberChange(e)}
                                    areas={this.state.user_areas}
                                    groups={this.state.user_groups}
                                    raise_warning={this.state.raise_warning}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col className='game-stats'>
                                <GameStats squares={this.state.squares}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Game;
