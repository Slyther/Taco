import React from 'react';

const CardModal = (props) => {
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

  export default CardModal;