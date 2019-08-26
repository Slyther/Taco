import React, { Component, Fragment } from 'react';
import './App.scss';

const EntityCreationModal = (props) => {
  return (
    <div className="modal fade" id={props.modalId} tabIndex="-1" role="dialog" aria-labelledby={`${props.modalId}Label`} aria-hidden="true">
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${props.modalId}Label`}>{props.title}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="message-text" className="col-form-label">{props.label}</label>
                <input className="form-control" id={props.valueId} onChange={props.handleChange} value={props.value || ''}></input>
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
            <button type="button" className="btn btn-primary" data-dismiss="modal" onClick={props.onCreate}>Create</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const CardViewModal = (props) => {
  const activity = props.card.activity.map(x => {
    let replaced = x;
    if(replaced.includes('{{') || replaced.includes('}}')){
      let id = replaced.substring(replaced.indexOf('{{')+2, replaced.indexOf('}}'));
      console.log(id);
      let columnName = props.columns.find(x => x._id === id).name;
      replaced = replaced.replace(`{{${id}}}`, columnName);
    }
    return (
      <p className="entry">{replaced}</p>
    );
  });
  return (
    <div className="modal fade" id={`cardView${props.card._id}`} tabIndex="-1" role="dialog" aria-labelledby={`${props.card._id}Label`} aria-hidden="true">
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id={`${props.card._id}Label`}>{props.card.name}</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p className="subtitle">Description</p>
            <textarea className="form-control column-name" id={`description_${props.card._id}`} onChange={props.handleChange} onBlur={props.submitCardChange} >{props.card.description || ''}</textarea>
            <p className="subtitle">Activity</p>
            <p className="content">
              {activity}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

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
      currentBoard: '',
      currentBoardId: 0
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value })
  }

  componentDidMount() {
    fetch(`http://localhost:5000/api/boards/`, {
      method: "GET",
    }).then(response => response.json())
    .then(response => {
      this.setState({boards: [...response]});
    });
  }

  returnToBoardsView = () => {
    this.setState({
      boardsView: true,
      boardView: false,
      cardView: false,
      cards: [],
      columns: [],
      currentBoard: '',
      currentBoardId: 0
    })
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
        this.setState({cards: [...response2], columns: [...response], boardsView: false, boardView: true, currentBoard: name, currentBoardId: id});
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
      this.setState({boards: [...this.state.boards, response], newBoard: ''});
    });
  }

  createColumn() {
    fetch(`http://localhost:5000/api/columns/`, {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
      ],
      body: JSON.stringify({ name: this.state.newColumn, board: this.state.currentBoardId  })
    }).then(response => response.json())
    .then(response => {
      this.setState({columns: [...this.state.columns, response], newColumn: ''});
    });
  }

  createCard(columnId) {
    const activity = `You added this card to {{${columnId}}}.`;
    fetch(`http://localhost:5000/api/cards/`, {
      method: "POST",
      headers: [
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
      ],
      body: JSON.stringify({ name: this.state.newCard, board: this.state.currentBoardId, column: columnId, activity: [activity] })
    }).then(response => response.json())
    .then(response => {
      this.setState({cards: [...this.state.cards, response], newCard: ''});
    });
  }

  submitColumnChange(id) {
    fetch(`http://localhost:5000/api/columns/${id}`, {
      method: "PUT",
      headers: [
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
      ],
      body: JSON.stringify({ name: this.state[`column_${id}`] })
    });
  }

  submitCardChange(id, changeType) {
    fetch(`http://localhost:5000/api/cards/${id}`, {
      method: "PUT",
      headers: [
        ["Content-Type", "application/json"],
        ["Accept", "application/json"],
      ],
      body: JSON.stringify({ description: this.state[`description_${id}`] })
    });
  }

  renderBoardsView = () => {
    const { boards } = this.state;
    const boardsView = boards.map(board => {

      return (
        <div className="col-md-3" key={board._id} onClick={() => this.getBoard(board._id, board.name)}>
          <div className="boardViewCard">{board.name}</div>
        </div>
      );
    });

    return (
      <div className="container">
        <h2><span className="icon-lg icon-member"></span>Boards</h2>
        <div className="row">
          {boardsView}
          <div className="col-md-3">
            <div className="boardCreationCard" data-toggle="modal" data-target="#boardModal">Create board...</div>
          </div>
        </div>
        <EntityCreationModal
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
  }

  renderBoard = () => {
    const { cards, columns, currentBoard } = this.state;

    const columnsView = columns.map(column => {
      const cardsView = cards.filter(card => card.column === column._id).map(card => {
        return (
          <Fragment>
            <div className="card" key={card._id} data-toggle="modal" data-target={`#cardView${card._id}`}>{card.name}</div>
            <CardViewModal card={card} columns={this.state.columns} handleChange={(e) => this.handleChange(e)} submitCardChange={() => this.submitCardChange(card._id)} />
          </Fragment>
        );
      });

      return (
        <div className="col-md-4 column-container" key={column._id}>
          <div className="column">
            <textarea className="form-control column-name" id={`column_${column._id}`} onChange={(e) => this.handleChange(e)} onBlur={() => this.submitColumnChange(column._id)} >{column.name}</textarea>
            <div className="cards-container">
              {cardsView} 
              <div className="card card-create" data-toggle="modal" data-target={`#cardModal${column._id}`}>Add a card...</div>
            </div>
            <EntityCreationModal
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
            <div className="boardCreationCard" data-toggle="modal" data-target="#columnModal">Add a column...</div>
          </div>
        </div>
        <EntityCreationModal
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

  render() {
    const { boardsView, boardView, cardView } = this.state;
    const JSX = (
      <Fragment>
        <div className="card-header text-center"> <span className="title" onClick={() => this.returnToBoardsView()}><b>Taco</b></span></div>
        { boardsView && this.renderBoardsView() }
        { boardView && this.renderBoard() }
        { cardView && this.renderCard() }
      </Fragment>
    );

    return JSX;
  }
}

export default App;
