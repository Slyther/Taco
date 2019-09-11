import React from 'react';

const InputModal = (props) => {
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

  export default InputModal;