import React, {Component} from 'react';
import StringEntityReplacementService from '../services/StringEntityReplacementService'

class CardModal extends Component {
    constructor(props) {
      super(props);
      this.state = {
        resolvedActivity: []
      }
      this.resolveActivity(props.card.activity);
    }

    resolveActivity(activity) {
      Promise.all(activity.map(x => StringEntityReplacementService.replace(x))).then(act => {
        this.setState({resolvedActivity: act});
      });
    }

    render() {
      return (
        <div className="modal fade" id={`cardView${this.props.card._id}`} tabIndex="-1" role="dialog" aria-labelledby={`${this.props.card._id}Label`} aria-hidden="true">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`${this.props.card._id}Label`}>{this.props.card.name}</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <p className="subtitle">Description</p>
                <textarea className="form-control column-name" id={`description_${this.props.card._id}`} onChange={this.props.handleChange} onBlur={this.props.submitCardChange} >{this.props.card.description || ''}</textarea>
                <p className="subtitle">Activity</p>
                <p className="content">
                  {this.state.resolvedActivity}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
  export default CardModal;