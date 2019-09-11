import React, { Fragment } from 'react';

const Menu = (props) => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <a className="navbar-brand" href="#na">Taco</a>
        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarText">
          <ul className="navbar-nav mr-auto">
            {
                props.isLoggedIn && 
                <Fragment>
                    <li className={`nav-item ${props.boardsView ? 'active' : ''}`}>
                        <a className="nav-link" href="#na" onClick={props.redirectToBoardsView}>Home</a>
                    </li>
                </Fragment>
            }
            {
                !props.isLoggedIn && 
                <Fragment>
                    <li className={`nav-item ${props.loginView ? 'active' : ''}`}>
                        <a className="nav-link" href="#na" onClick={props.redirectToLoginView}>Login</a>
                    </li>
                    <li className={`nav-item ${props.registerView ? 'active' : ''}`}>
                        <a className="nav-link" href="#na" onClick={props.redirectToRegisterView}>Register</a>
                    </li>
                </Fragment>
            }
          </ul>
            {
                props.isLoggedIn && 
                <div className="navbar-nav nav-item dropdown col-md-2">
                    <a className="nav-link dropdown-toggle active" href="#na" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">{props.userInfo.username}</a>
                    <div className="dropdown-menu" aria-labelledby="navbarDropdown">
                        <a className="dropdown-item" href="#na" onClick={props.redirectToBoardsView}>My Boards</a>
                        <a className="dropdown-item" href="#na" onClick={props.redirectToCardsListView}>My Cards</a>
                        <div className="dropdown-divider"></div>
                        <a className="dropdown-item" href="#na" onClick={props.logout}>Logout</a>
                    </div>
                </div>
            }
        </div>
      </nav>
    );
}

export default Menu;