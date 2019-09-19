import React, { Component } from 'react';
import InputModal from '../components/InputModal';

class BoardsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newBoard: '',
      boards: [...props.boards],
      userInfo: { ...props.userInfo },
      showModal: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  static getDerivedStateFromProps(props, state) {
    if (props.boards.length !== state.boards.length)
      return {
        newBoard: '',
        boards: [...props.boards],
        userInfo: { ...props.userInfo },
      };
    return null;
  }

  render() {
    const { boards, showModal } = this.state;
    const boardsView = boards.map((board) => {
      return (
        <div
          className="col-md-3"
          key={board._id}
          onClick={() => this.props.getBoard(board._id, board.name)}>
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
              onClick={() => this.setState({ showModal: true })}>
              Create board...
            </div>
          </div>
        </div>
        {
          showModal &&
          <InputModal
            title="Add Board Title"
            label="Title:"
            handleChange={(e) => this.handleChange(e)}
            value={this.state.newBoard}
            onCreate={() => {
              this.props.createBoard(this.state.newBoard);
              this.setState({ showModal: false });
            }}
            valueId="newBoard"
            show={showModal}
            closeModal={() => this.setState({ showModal: false })}
          />
        }
      </div>
    );
  }
}

export default BoardsView;
