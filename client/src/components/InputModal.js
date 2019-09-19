import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const InputModal = (props) => {
  return (
    <Modal show={props.show} onHide={props.closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              props.onCreate();
            }
          }}>
          <Form.Group controlId={props.valueId}>
            <Form.Label>{props.label}</Form.Label>
            <Form.Control
              onChange={props.handleChange}
              value={props.value || ''}></Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={props.closeModal}>
          Close
        </Button>
        <Button variant="primary" onClick={props.onCreate}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default InputModal;
