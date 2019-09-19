import React, { Component } from 'react';
import { Modal, DropdownButton, Dropdown } from 'react-bootstrap';
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
          <Dropdown.Item
            key={column._id}
            onClick={() =>
              this.props.changeColumn(this.props.card, column._id)
            }>
            {column.name}
          </Dropdown.Item>
        );
      });

    const usersJSX = this.props.currentBoard.users
      .filter((user) => this.props.card.handler !== user._id)
      .map((user) => {
        return (
          <Dropdown.Item
            key={user._id}
            onClick={() => this.props.assignUser(this.props.card, user._id)}>
            {user.username}
          </Dropdown.Item>
        );
      });

    let currentUser = this.props.currentBoard.users.find(
      (x) => x._id === this.props.card.handler
    );
    if (currentUser) {
      currentUser = currentUser.username;
    } else {
      currentUser = 'None Assigned';
    }

    return (
      <Modal show={this.props.show} onHide={this.props.closeModal} size="lg">
        <Modal.Header closeButton style={{ borderBottomColor: '#3e5369' }}>
          <Modal.Title>{this.props.card.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="row">
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
            <div className="content">
              {this.state.resolvedActivity.map((act) => {
                return (
                  <p key={act} className="activity-entry">
                    {act}
                  </p>
                );
              })}
            </div>
          </div>
          <div className="col-md-3">
            <h6 className="text-center">Actions</h6>
            <div>Move</div>
            <DropdownButton
              variant="secondary"
              title={
                this.props.columns.find((x) => x._id === this.props.card.column)
                  .name
              }>
              {columnsJSX}
            </DropdownButton>
            <div className="mrg-top-30">Assign User</div>
            <DropdownButton variant="secondary" title={currentUser}>
              {usersJSX}
            </DropdownButton>
          </div>
        </Modal.Body>
      </Modal>
    );
  }
}
export default CardModal;