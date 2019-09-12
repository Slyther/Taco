import React, { Component, Fragment } from 'react';
import CardModal from './CardModal';
import InputModal from '../components/InputModal';

class BoardView extends Component {
    constructor(props){
        super(props);
        this.state = {
            cards: [...props.cards],
            columns: [...props.columns],
            currentBoard: props.currentBoard,
            currentBoardId: props.currentBoardId,
            userInfo: {...props.userInfo}
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    submitCardChange(id, changeType) {
        fetch(`http://localhost:5000/api/cards/${id}`, {
            method: 'PUT',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            credentials: 'include',
            body: JSON.stringify({
                description: this.state[`description_${id}`],
            }),
        });
    }

    changeColumn(card, columnId) {
        fetch(`http://localhost:5000/api/cards/${card._id}`, {
            method: 'PUT',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            credentials: 'include',
            body: JSON.stringify({
                column: columnId,
                activity: [...card.activity, `{{user:${this.props.userInfo.id}}} moved this card from {{column:${card.column}}} to {{column:${columnId}}}`]
            })
        }).then((response) => {
            fetch(`http://localhost:5000/api/cards/${this.state.currentBoardId}`, {
                method: 'GET',
                headers: [
                    ['Content-Type', 'application/json'],
                    ['Accept', 'application/json'],
                ],
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((response) => {
                this.setState({cards: [...response]});
            });
        });
    }

    assignUser(card, userId) {
        fetch(`http://localhost:5000/api/cards/${card._id}`, {
            method: 'PUT',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            credentials: 'include',
            body: JSON.stringify({
                handler: userId,
                activity: [...card.activity, `{{user:${this.props.userInfo.id}}} assigned this card to {{user:${userId}}}`]
            })
        }).then((response) => {
            fetch(`http://localhost:5000/api/cards/${this.state.currentBoardId}`, {
                method: 'GET',
                headers: [
                    ['Content-Type', 'application/json'],
                    ['Accept', 'application/json'],
                ],
                credentials: 'include'
            })
            .then((response) => response.json())
            .then((response) => {
                this.setState({cards: [...response]});
            });
        });
    }

    submitColumnChange(id) {
        fetch(`http://localhost:5000/api/columns/${id}`, {
            method: 'PUT',
            credentials: 'include',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            body: JSON.stringify({ name: this.state[`column_${id}`] }),
        });
    }

    createCard(columnId) {
        const activity = `{{user:${this.state.userInfo.id}}} added this card to {{column:${columnId}}}.`;
        fetch(`http://localhost:5000/api/cards/`, {
            method: 'POST',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            credentials: 'include',
            body: JSON.stringify({
                name: this.state.newCard,
                board: this.state.currentBoardId,
                column: columnId,
                activity: [activity],
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    cards: [...this.state.cards, response],
                    newCard: '',
                });
            });
    }

    createColumn() {
        fetch(`http://localhost:5000/api/columns/`, {
            method: 'POST',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            credentials: 'include',
            body: JSON.stringify({
                name: this.state.newColumn,
                board: this.state.currentBoardId,
            }),
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    columns: [...this.state.columns, response],
                    newColumn: '',
                });
            });
    }

    render() {
        const { cards, columns, currentBoard } = this.state;

        const columnsView = columns.map((column) => {
            const cardsView = cards
                .filter((card) => card.column === column._id)
                .map((card) => {
                    return (
                        <Fragment>
                            <div
                                className="card"
                                key={card._id}
                                data-toggle="modal"
                                data-target={`#cardView${card._id}`}>
                                {card.name}
                            </div>
                            <CardModal
                                card={card}
                                columns={this.state.columns}
                                currentBoard={this.props.currentBoardObject}
                                handleChange={(e) => this.handleChange(e)}
                                submitCardChange={() =>
                                    this.submitCardChange(card._id)
                                }
                                changeColumn={(card, columnId) =>
                                    this.changeColumn(card, columnId)
                                }
                                assignUser={(card, userId) =>
                                    this.assignUser(card, userId)
                                }
                            />
                        </Fragment>
                    );
                });

            return (
                <div className="col-md-4 column-container" key={column._id}>
                    <div className="column">
                        <textarea
                            className="form-control column-name"
                            id={`column_${column._id}`}
                            onChange={(e) => this.handleChange(e)}
                            onBlur={() => this.submitColumnChange(column._id)}>
                            {column.name}
                        </textarea>
                        <div className="cards-container">
                            {cardsView}
                            <div
                                className="card card-create"
                                data-toggle="modal"
                                data-target={`#cardModal${column._id}`}>
                                Add a card...
                            </div>
                        </div>
                        <InputModal
                            modalId={`cardModal${column._id}`}
                            title="Add Card Name"
                            label="Name:"
                            handleChange={(e) => this.handleChange(e)}
                            value={this.state.newCard}
                            onCreate={() => this.createCard(column._id)}
                            valueId="newCard"
                        />
                    </div>
                </div>
            );
        });

        return (
            <div className="container board-container">
                <h2>{currentBoard}</h2>
                <div className="row noWrap">
                    {columnsView}
                    <div className="col-md-4 column-container">
                        <div
                            className="boardCreationCard"
                            data-toggle="modal"
                            data-target="#columnModal">
                            Add a column...
                        </div>
                    </div>
                </div>
                <InputModal
                    modalId="columnModal"
                    title="Add Column Name"
                    label="Name:"
                    handleChange={(e) => this.handleChange(e)}
                    value={this.state.newColumn}
                    onCreate={() => this.createColumn()}
                    valueId="newColumn"
                />
            </div>
        );
    }
}

export default BoardView;