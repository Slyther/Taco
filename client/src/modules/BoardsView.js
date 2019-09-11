import React, { Component } from 'react';
import InputModal from '../components/InputModal';

class BoardsView extends Component {
    constructor(props){
        super(props);
        this.state = {
            newBoard: '',
            boards: [...props.boards],
            userInfo: { ...props.userInfo }
        }
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    static getDerivedStateFromProps(props, state) {
        if(props.boards.length !== state.boards.length)
            return { newBoard: '', boards: [...props.boards], userInfo: {...props.userInfo} };
        return null;
    }

    render() {
        const { boards } = this.state;
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
                    onCreate={() => this.props.createBoard(this.state.newBoard)}
                    valueId="newBoard"
                />
            </div>
        );
    }
}

export default BoardsView;