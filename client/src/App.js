import React, { Component, Fragment } from 'react';
import './App.scss';
import InputModal from './components/InputModal';
import CardModal from './modules/CardModal';
import Login from './modules/Login';
import Menu from './modules/Menu';

class App extends Component {
    constructor() {
        super();
        this.state = {
            isLoggedIn: false,
            userInfo: {},
            boardsView: false,
            boards: [],
            boardView: false,
            cardView: false,
            cards: [],
            columns: [],
            currentBoard: '',
            currentBoardId: 0,
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    componentDidMount() {
        fetch(`http://localhost:5000/api/users/login/`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => response.json())
        .then((response) => {
            if(!response.msg){
                this.handleLogin(response);
            }
        });
    }

    logout = () => {
        fetch(`http://localhost:5000/api/users/logout/`, {
            method: 'GET',
            credentials: 'include',
        })
        .then((response) => response.json())
        .then((response) => {
            if(response.msg){
                this.setState({
                    userInfo: {},
                    isLoggedIn: false,
                    boardsView: false,
                    boards: []
                });
            }
        });
    }

    handleLogin = (info) => {
        this.setState({
            userInfo: info,
            isLoggedIn: true,
            boardsView: true,
            boards: [...info.boards]
        });
    }

    redirectToBoardsView = () => {
        this.setState({
            boardsView: true,
            boardView: false,
            cardView: false,
            cards: [],
            columns: [],
            currentBoard: '',
            currentBoardId: 0,
        });
    };

    redirectToRegisterView = () => {

    }

    getBoard(id, name) {
        fetch(`http://localhost:5000/api/columns/${id}`, {
            method: 'GET',
        })
            .then((response) => response.json())
            .then((response) => {
                fetch(`http://localhost:5000/api/cards/${id}`, {
                    method: 'GET',
                })
                    .then((response2) => response2.json())
                    .then((response2) => {
                        this.setState({
                            cards: [...response2],
                            columns: [...response],
                            boardsView: false,
                            boardView: true,
                            currentBoard: name,
                            currentBoardId: id,
                        });
                    });
            });
    }

    createBoard() {
        fetch(`http://localhost:5000/api/boards/`, {
            method: 'POST',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            body: JSON.stringify({ name: this.state.newBoard }),
        })
            .then((response) => response.json())
            .then((response) => {
                this.setState({
                    boards: [...this.state.boards, response],
                    newBoard: '',
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

    createCard(columnId) {
        const activity = `You added this card to {{${columnId}}}.`;
        fetch(`http://localhost:5000/api/cards/`, {
            method: 'POST',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
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

    submitColumnChange(id) {
        fetch(`http://localhost:5000/api/columns/${id}`, {
            method: 'PUT',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            body: JSON.stringify({ name: this.state[`column_${id}`] }),
        });
    }

    submitCardChange(id, changeType) {
        fetch(`http://localhost:5000/api/cards/${id}`, {
            method: 'PUT',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            body: JSON.stringify({
                description: this.state[`description_${id}`],
            }),
        });
    }

    renderBoardsView = () => {
        const { boards } = this.state;
        const boardsView = boards.map((board) => {
            return (
                <div
                    className="col-md-3"
                    key={board._id}
                    onClick={() => this.getBoard(board._id, board.name)}>
                    <div className="boardViewCard">{board.name}</div>
                </div>
            );
        });

        return (
            <div className="container">
                <h2>
                    <span className="icon-lg icon-member"></span>Boards
                </h2>
                <div className="row">
                    {boardsView}
                    <div className="col-md-3">
                        <div
                            className="boardCreationCard"
                            data-toggle="modal"
                            data-target="#boardModal">
                            Create board...
                        </div>
                    </div>
                </div>
                <InputModal
                    modalId="boardModal"
                    title="Add Board Title"
                    label="Title:"
                    handleChange={(e) => this.handleChange(e)}
                    value={this.state.newBoard}
                    onCreate={() => this.createBoard()}
                    valueId="newBoard"
                />
            </div>
        );
    };

    renderBoard = () => {
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
                                handleChange={(e) => this.handleChange(e)}
                                submitCardChange={() =>
                                    this.submitCardChange(card._id)
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
    };

    render() {
        const { boardsView, boardView, cardView, isLoggedIn } = this.state;
        const JSX = (
            <Fragment>
                <Menu isLoggedIn={this.state.isLoggedIn} userInfo={this.state.userInfo} logout={this.logout}/>
                {!isLoggedIn && <Login onLogin={this.handleLogin}/>}
                {boardsView && this.renderBoardsView()}
                {boardView && this.renderBoard()}
                {cardView && this.renderCard()}
            </Fragment>
        );

        return JSX;
    }
}

export default App;
