import React, { Component, Fragment } from 'react';

class Register extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            validationResult: []
        };
    }

    handleChange = (e) => {
        this.setState({ [e.target.id]: e.target.value });
    };

    submitRegistration = () => {
        fetch(`http://localhost:5000/api/users/register/`, {
            method: 'POST',
            headers: [
                ['Content-Type', 'application/json'],
                ['Accept', 'application/json'],
            ],
            credentials: 'include',
            body: JSON.stringify({ email: this.state.email, password: this.state.password }),
        })
        .then((response) => response.json())
        .then((response) => {
            if(!response.validationResult) {
                this.props.onRegister(response);
            }else {
                this.setState({validationResult: response.validationResult})
            }
        });
    }

    render() {
        return (
            <Fragment>
                <div className="card login-card">
                    <form className="card-body"  onSubmit={() => this.submitRegistration()}>
                        <h3 className="card-title">Register</h3>
                        <div className="form-group">
                            <label htmlFor="email" className="col-form-label">E-mail:</label>
                            <input className="form-control" id="email" onChange={this.handleChange} value={this.state.email}></input>
                            <label htmlFor="password" className="col-form-label">Password:</label>
                            <input className="form-control" id="password" type="password" onChange={this.handleChange} value={this.state.password}></input>
                        </div>
                        <button className="form-control btn btn-primary" type="submit">Log In</button>
                    </form>
                </div>
            </Fragment>
        );
    }
}

export default Register;
