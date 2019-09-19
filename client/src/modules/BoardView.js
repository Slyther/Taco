import React, { Component } from 'react';
import CardModal from './CardModal';
import InputModal from '../components/InputModal';

class BoardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cards: [...props.cards],
      columns: [...props.columns],
      currentBoard: props.currentBoard,
      currentBoardId: props.currentBoardId,
      userInfo: { ...props.userInfo },
      showInputModal: false,
      showCardModal: false,
      inputModal: {
        title:'',
        label:'',
        value:'',
        valueId:'',
        onCreate: {},
      },
      cardModal: {
        card: {},
      }
    };
  }

  handleChange = (e) => {
    console.log(e.target.id);
    this.setState({ [e.target.id]: e.target.value });
  };

  submitCardChange(id) {
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

  showColumnCreationModal = () => {
    this.setState({
      showInputModal: true,
      inputModal: {
        title: "Add Column Name",
        label: "Name:",
        valueId: "newColumn",
        onCreate: (card, columnId) => this.createColumn(card, columnId)
      }
    });
  }

  showCardCreationModal = (columnId) => {
    this.setState({
      showInputModal: true,
      inputModal: {
        title: "Add Card Name",
        label: "Name:",
        valueId: "newCard",
        onCreate: () => this.createCard(columnId)
      }
    });
  }

  showCardModal = (card) => {
    this.setState({
      showCardModal: true,
      cardModal: {
        card: card
      }
    })
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
        activity: [
          ...card.activity,
          `{{User:${this.props.userInfo.id}}} moved this card from {{Column:${card.column}}} to {{Column:${columnId}}}`,
        ],
      }),
    }).then((response) => {
      fetch(`http://localhost:5000/api/cards/${this.state.currentBoardId}`, {
        method: 'GET',
        headers: [
          ['Content-Type', 'application/json'],
          ['Accept', 'application/json'],
        ],
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({ cards: [...response] });
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
        activity: [
          ...card.activity,
          `{{User:${this.props.userInfo.id}}} assigned this card to {{User:${userId}}}`,
        ],
      }),
    }).then((response) => {
      fetch(`http://localhost:5000/api/cards/${this.state.currentBoardId}`, {
        method: 'GET',
        headers: [
          ['Content-Type', 'application/json'],
          ['Accept', 'application/json'],
        ],
        credentials: 'include',
      })
        .then((response) => response.json())
        .then((response) => {
          this.setState({ cards: [...response], cardModal: { card: response.find(x => x._id === this.state.cardModal.card._id)} });
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
    const activity = `{{User:${this.state.userInfo.id}}} added this card to {{Column:${columnId}}}.`;
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
    const { cards, columns, currentBoard, showInputModal, showCardModal, inputModal, cardModal } = this.state;

    const columnsView = columns.map((column) => {
      const cardsView = cards
        .filter((card) => card.column === column._id)
        .map((card) => {
          return (
            <div
              className="card"
              key={card._id}
              onClick={() => { this.showCardModal(card) }}>
              {card.name}
            </div>
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
                onClick={() => { this.showCardCreationModal(column._id) }}>
                Add a card...
              </div>
            </div>
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
              onClick={() => { this.showColumnCreationModal()}}>
              Add a column...
            </div>
          </div>
        </div>
        {
          showInputModal && 
          <InputModal
            title={inputModal.title}
            label={inputModal.label}
            handleChange={(e) => this.handleChange(e)}
            value={this.state[inputModal.valueId]}
            onCreate={() => {
              inputModal.onCreate();
              this.setState({showInputModal: false})
            }}
            valueId={inputModal.valueId}
            show={showInputModal}
            closeModal={() => this.setState({ showInputModal: false })}
          />
        }
        {
          showCardModal && 
          <CardModal
            card={cardModal.card}
            columns={this.state.columns}
            currentBoard={this.props.currentBoardObject}
            handleChange={(e) => this.handleChange(e)}
            submitCardChange={() => this.submitCardChange(cardModal.card._id)}
            changeColumn={(card, columnId) => {
              this.changeColumn(card, columnId);
              this.setState({ showCardModal: false });
            }}
            assignUser={(card, userId) => this.assignUser(card, userId)}
            show={showCardModal}
            closeModal={() => this.setState({ showCardModal: false })}
          />
        }
      </div>
    );
  }
}

export default BoardView;
