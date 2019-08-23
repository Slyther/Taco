import React, { Component, Fragment } from 'react';
import './App.scss';

class App extends Component {
  constructor() {
    super();
    this.state = {
      boardsView: true,
      boards: [],
      boardView: false,
      cardView: false,
      cards: [],
      columns: [],
      currentBoard: ''
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  submitEntry = () => {
    const { num1, num2, operator } = this.state;
    let number1 = Number(num1);
    let number2 = Number(num2);

    fetch(`http://localhost:5000/api/${operator}`, {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
      ],
      body: JSON.stringify({ num1: number1, num2: number2 })
    }).then(response => response.json())
    .then(response => {
      if(typeof response.errorMsg !== 'undefined'){
        this.setState({
          result: response.errorMsg, 
          isNum2: false, 
          isCompletelyDisabled: false, 
          num1: '', 
          num2: '', 
          operator: '', 
          isDotDisabled: false
        });
      } else {
        this.setState({
          result: response.result,
          isNum2: false, 
          isCompletelyDisabled: false, 
          num1: `${response.result}`, 
          num2: '', 
          operator: '', 
          isDotDisabled: false
        });
      }
    });
  };

  componentDidMount() {
    fetch(`http://localhost:5000/api/boards/`, {
      method: "GET",
    }).then(response => response.json())
    .then(response => {
      this.setState({boards: [...response]});
    });
  }

  getBoard(id, name) {
    fetch(`http://localhost:5000/api/columns/${id}`, {
      method: "GET",
    }).then(response => response.json())
    .then(response => {
      fetch(`http://localhost:5000/api/cards/${id}`, {
        method: "GET",
      }).then(response2 => response2.json())
      .then(response2 => {
        this.setState({cards: [...response2], columns: [...response], boardsView: false, boardView: true, currentBoard: name});
      });
    });
  }

  createBoard() {
    fetch(`http://localhost:5000/api/boards/`, {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
      ],
      body: JSON.stringify({ name: this.state.newBoard })
    }).then(response => response.json())
    .then(response => {
      this.setState({boards: [...this.state.boards, response]});
    });
  }

  renderBoardsView = () => {
    const { boards } = this.state;
    const boardsView = boards.map(board => {

      return (<div className="boardViewCard col-md-4" onClick={() => this.getBoard(board._id, board.name)}>{board.name}</div>)
    });

    return (
      <div className="container">
        <h2>Boards</h2>
        <div className="row">
          {boardsView}
          <div className="boardCreationCard col-md-4" data-toggle="modal" data-target="#exampleModal">Create board...</div>
        </div>
        <div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Add Board Title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="form-group">
                    <label htmlFor="message-text" className="col-form-label">Title:</label>
                    <input className="form-control" id="newBoard" onChange={(e) => this.handleChange(e)}></input>
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={() => this.createBoard()}>Create</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderBoard = () => {
    const { cards, columns, currentBoard } = this.state;

    const columnsView = columns.map(column => {
      const cardsView = cards.map(card => {
        return (<div className="card">{card.name}</div>);
      });

      return (
        <div className="column">
          <h3>{column.name}</h3>
          {cardsView} 
        </div>
      );
    });

    return (
      <div className="container">
        <h2>{currentBoard}</h2>
        {columnsView}
      </div>
    );
  }

  render() {
    const { boardsView, boardView, cardView } = this.state;
    const JSX = (
      <Fragment>
        { boardsView && this.renderBoardsView() }
        { boardView && this.renderBoard() }
        { cardView && this.renderCard() }
      </Fragment>
    );

    return JSX;
  }
}

export default App;
