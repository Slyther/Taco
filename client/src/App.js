import React, { Component, Fragment } from 'react';
import './App.scss';
import Login from './modules/Login';
import Register from './modules/Register';
import BoardView from './modules/BoardView';
import BoardsView from './modules/BoardsView';
import Menu from './modules/Menu';

class App extends Component {
  constructor() {
    super();
    this.state = {
      isLoggedIn: false,
      userInfo: {},
      boardsView: false,
      boardView: false,
      cardsListView: false,
      loginView: true,
      registerView: false,
      boards: [],
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
    this.checkLogin();
  }

  checkLogin() {
    fetch(`http://localhost:5000/api/users/login/`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        if (!response.msg) {
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
        if (response.msg) {
          this.redirectToLoginView();
        }
      });
  };

  handleLogin = (info) => {
    this.setState({
      userInfo: info,
      isLoggedIn: true,
      boardsView: true,
      loginView: false,
      boards: [...info.boards],
    });
  };

  redirectToBoardsView = () => {
    this.setState(
      {
        boardsView: true,
        boardView: false,
        cardsListView: false,
        loginView: false,
        registerView: false,
        cards: [],
        columns: [],
        currentBoard: '',
        currentBoardId: 0,
      },
      () => this.checkLogin()
    );
  };

  redirectToCardsListView = () => {
    this.setState({
      boardsView: false,
      boardView: false,
      cardsListView: true,
      loginView: false,
      registerView: false,
      cards: [],
      columns: [],
      currentBoard: '',
      currentBoardId: 0,
    });
  };

  redirectToRegisterView = () => {
    this.setState({
      isLoggedIn: false,
      userInfo: {},
      boardsView: false,
      boardView: false,
      cardsListView: false,
      loginView: false,
      registerView: true,
      boards: [],
      cards: [],
      columns: [],
      currentBoard: '',
      currentBoardId: 0,
    });
  };

  redirectToLoginView = () => {
    this.setState({
      isLoggedIn: false,
      userInfo: {},
      boardsView: false,
      boardView: false,
      cardsListView: false,
      loginView: true,
      registerView: false,
      boards: [],
      cards: [],
      columns: [],
      currentBoard: '',
      currentBoardId: 0,
    });
  };

  getBoard(id, name) {
    fetch(`http://localhost:5000/api/boards/${id}`, {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((response) => {
        fetch(`http://localhost:5000/api/columns/${id}`, {
          method: 'GET',
          credentials: 'include',
        })
          .then((response2) => response2.json())
          .then((response2) => {
            fetch(`http://localhost:5000/api/cards/${id}`, {
              method: 'GET',
              credentials: 'include',
            })
              .then((response3) => response3.json())
              .then((response3) => {
                this.setState({
                  cards: [...response3],
                  columns: [...response2],
                  boardsView: false,
                  boardView: true,
                  currentBoard: name,
                  currentBoardId: id,
                  currentBoardObject: { ...response },
                });
              });
          });
      });
  }

  createBoard(boardName) {
    fetch(`http://localhost:5000/api/boards/`, {
      method: 'POST',
      headers: [
        ['Content-Type', 'application/json'],
        ['Accept', 'application/json'],
      ],
      credentials: 'include',
      body: JSON.stringify({
        name: boardName,
        owner: this.state.userInfo.id,
        users: [this.state.userInfo.id],
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.setState({
          boards: [...this.state.boards, response],
        });
      });
  }

  render() {
    const {
      boardsView,
      boardView,
      cardsListView,
      loginView,
      registerView,
      isLoggedIn,
      userInfo,
      boards,
      cards,
      columns,
      currentBoardId,
      currentBoard,
      currentBoardObject,
    } = this.state;
    const JSX = (
      <Fragment>
        <Menu
          isLoggedIn={isLoggedIn}
          userInfo={userInfo}
          logout={this.logout}
          redirectToBoardsView={this.redirectToBoardsView}
          redirectToLoginView={this.redirectToLoginView}
          redirectToRegisterView={this.redirectToRegisterView}
          redirectToCardsListView={this.redirectToCardsListView}
          loginView={loginView}
          registerView={registerView}
          boardsView={boardsView}
        />
        {loginView && <Login onLogin={this.handleLogin} />}
        {registerView && <Register onRegister={this.redirectToLoginView} />}
        {boardsView && (
          <BoardsView
            getBoard={(id, name) => this.getBoard(id, name)}
            boards={boards}
            userInfo={userInfo}
            createBoard={(newBoard) => this.createBoard(newBoard)}
          />
        )}
        {boardView && (
          <BoardView
            cards={cards}
            columns={columns}
            currentBoard={currentBoard}
            currentBoardId={currentBoardId}
            currentBoardObject={currentBoardObject}
            userInfo={userInfo}
          />
        )}
      </Fragment>
    );

    return JSX;
  }
}

export default App;
