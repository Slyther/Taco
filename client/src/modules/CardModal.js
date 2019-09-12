import React, { Component } from 'react';
import StringEntityReplacementService from '../services/StringEntityReplacementService';

class CardModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resolvedActivity: [],
        };
        this.resolveActivity(props.card.activity);
    }

    resolveActivity(activity) {
        Promise.all(
            activity.map((x) => StringEntityReplacementService.replace(x))
        ).then((act) => {
            this.setState({ resolvedActivity: act });
        });
    }

    render() {
        const columnsJSX = this.props.columns
            .filter((column) => this.props.card.column !== column._id)
            .map((column) => {
                return (
                    <div
                        className="dropdown-item"
                        data-dismiss="modal"
                        onClick={() =>
                            this.props.changeColumn(this.props.card, column._id)
                        }>
                        {column.name}
                    </div>
                );
            });

        const usersJSX = this.props.currentBoard.users
            .filter((user) => this.props.card.handler !== user._id)
            .map((user) => {
                return (
                    <div
                        className="dropdown-item"
                        data-dismiss="modal"
                        onClick={() =>
                            this.props.assignUser(this.props.card, user._id)
                        }>
                        {user.username}
                    </div>
                );
            });

        let currentUser = this.props.currentBoard.users.find((x) => x._id === this.props.card.handler);
        if(currentUser){
          currentUser = currentUser.username;
        }else {
          currentUser = "None Assigned";
        }

        return (
            <div
                className="modal fade"
                id={`cardView${this.props.card._id}`}
                tabIndex="-1"
                role="dialog"
                aria-labelledby={`${this.props.card._id}Label`}
                aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div
                            className="modal-header"
                            style={{ borderBottomColor: '#3e5369' }}>
                            <h5
                                className="modal-title"
                                id={`${this.props.card._id}Label`}>
                                {this.props.card.name}
                            </h5>
                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                                aria-label="Close">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body row">
                            <div className="col-md-9">
                                <h6 className="subtitle">Description</h6>
                                <textarea
                                    className="form-control card-description"
                                    id={`description_${this.props.card._id}`}
                                    onChange={this.props.handleChange}
                                    onBlur={this.props.submitCardChange}
                                    placeholder="Write a description here.">
                                    {this.props.card.description || ''}
                                </textarea>
                                <h6 className="subtitle">Activity</h6>
                                <p className="content">
                                    {this.state.resolvedActivity.map((act) => {
                                        return (
                                            <p className="activity-entry">
                                                {act}
                                            </p>
                                        );
                                    })}
                                </p>
                            </div>
                            <div className="col-md-3">
                                <h6 className="text-center">Actions</h6>
                                <div>Move</div>
                                <div className="dropdown">
                                    <a
                                        className="btn btn-secondary dropdown-toggle"
                                        href="#na"
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        {
                                            this.props.columns.find(
                                                (x) =>
                                                    x._id ===
                                                    this.props.card.column
                                            ).name
                                        }
                                    </a>

                                    <div
                                        className="dropdown-menu"
                                        aria-labelledby="dropdownMenuLink">
                                        {columnsJSX}
                                    </div>
                                </div>
                                <div className="mrg-top-30">Assign User</div>
                                <div className="dropdown">
                                    <a
                                        className="btn btn-secondary dropdown-toggle"
                                        href="#na"
                                        role="button"
                                        id="dropdownMenuLink"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false">
                                        {
                                            currentUser
                                        }
                                    </a>

                                    <div
                                        className="dropdown-menu"
                                        aria-labelledby="dropdownMenuLink">
                                        {usersJSX}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
export default CardModal;
