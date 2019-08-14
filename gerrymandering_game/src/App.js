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

const colors = ['crimson', 'dodgerblue', 'gold', 'mediumseagreen', 'mediumorchid', 'pink', 'orange', 'paleturquoise'];
const groupNames = 'ABCDEFGH';


function Square(props) {
    const square_style = {
        display: 'inline-block',
        backgroundColor: props.bgColor,
        width: 100,
        height: 100,
        border: '1px solid black',
        margin: '2px 2px 2px 2px',
    };

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

    function countVotes(districtVotes, square) { // Add votes of each population in a square to a district
        const populations = square.populations.slice();
        const district = square.district;

        if (!districtVotes.hasOwnProperty(district)) { // If the district hasn't been counted yet, add it
            districtVotes[district] = []
        }
        const vote_list = districtVotes[district];

        for (let i = 0; i < populations.length; i++) { // Add the votes from the square to its district

            if (vote_list[i]) {
                vote_list[i] += populations[i];
            } else {
                vote_list[i] = populations[i];
            }
        }
    }

    function countDistrictVotes(squares) {
        const districtVotes = {};

        for (let i = 0; i < squares.length; i++) {
            countVotes(districtVotes, squares[i]);
        }

        return districtVotes;
    }

    function majorityGroup(cumulativePopulations) {
        let majorityIndex = 0;
        for (let groupIndex in cumulativePopulations) {
            if (cumulativePopulations[groupIndex] > cumulativePopulations[majorityIndex]) {
                majorityIndex = groupIndex;
            }
        }
        return majorityIndex;
    }

    function countPopularVote(squares) {
        const votes = {};
        for (let square = 0; square < squares.length; square++) {

            const populations = squares[square].populations;
            for (let population in populations) {
                const group = groupNames[population];

                if (!votes.hasOwnProperty(group)) {
                    votes[group] = 0;
                }
                votes[group] += populations[population];

            }
        }

        return votes;
    }

    if (props.gameMode === 'single') {
        const districtVotes = countDistrictVotes(props.squares);
        const districtReps = {};
        let districtRepsStr = '';
        const groupDistricts = {};
        let groupDistrictsStr = '';

        for (let district in districtVotes) {
            districtReps[district] = majorityGroup(districtVotes[district]);

            if (!groupDistricts.hasOwnProperty(districtReps[district]) && district !== '-1') {
                groupDistricts[districtReps[district]] = 1;
            } else if (district !== '-1') {
                groupDistricts[districtReps[district]] += 1;
            }
            districtRepsStr += colors[district] + ': ' + groupNames[districtReps[district]] + '\n';
        }
        for (let group in groupDistricts) {
            groupDistrictsStr += groupNames[group] + ': ' + groupDistricts[group] + '\n';
        }

        return (
            <div>
                <h5><b>Game Stats</b></h5>
                <Row>
                    <Col>
                        <h6>Representative of each district:</h6>
                        <div>{districtRepsStr+'\n'}</div>
                    </Col>
                    <Col>
                        <h6>Num. of representatives per group:</h6>
                        <div>{groupDistrictsStr}</div>
                    </Col>
                </Row>
            </div>
        );
    } else { // game mode is proportional
        const votes = countPopularVote(props.squares);
        let total = 0;
        const reps = {};
        let repsStr = '';
        for (let group in votes) {
            total += votes[group];
        }
        for (let group in votes) {
            reps[group] = Math.round(8*votes[group]/total);
            repsStr += group + ' ('+ votes[group] + '): ' + reps[group] + '\n';
        }
        return (
            <div>
                <h5><b>Game Stats</b></h5>
                <h6>Population and representatives for each group:</h6>
                <div>{repsStr}</div>
            </div>
        )
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
            squares.push({district: -1, populations: populations, bgColor: '#ffffff', key: i});
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
        // const colors = ['crimson', 'dodgerblue', 'gold', 'mediumseagreen', 'mediumorchid',
        // 'pink', 'orange', 'paleturquoise'];
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
                squares.push({district: -1, populations: populations, bgColor: '#ffffff', key: i});
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
                                <GameStats squares={this.state.squares} gameMode={this.state.game_mode}/>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Game;
