import React, { Component } from "react";
import { Route, Switch, withRouter } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import Users from "./components/Users";
import About from "./components/About";
import Nav from "./components/Nav";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import UserStatus from "./components/UserStatus";
import Message from "./components/Message";
import AddUser from "./components/AddUser";

const modalStyles = {
  content: {
    top: "0",
    left: "0",
    right: "0",
    bottom: "0",
    border: 0,
    background: "transparent"
  }
};

Modal.setAppElement(document.getElementById("root"));

class App extends Component {
  state = {
    users: [],
    title: "Wakemaps",
    messageType: null,
    messageText: null,
    showModal: false
  };

  getUsers() {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/users`;
    axios
      .get(url)
      .then(res => this.setState({ users: res.data.data.users }))
      .catch(e => {
        // console.log(e);
      });
  }

  createMessage(type, text) {
    this.setState({
      messageType: type,
      messageText: text
    });

    setTimeout(() => {
      this.removeMessage();
    }, 3000);
  }

  removeMessage = () => {
    this.setState({
      messageType: null,
      messageText: null
    });
  };

  addUser = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/users`;
    axios
      .post(url, data)
      .then(res => {
        this.getUsers();
        this.setState({ username: "", email: "" });
        this.createMessage("success", "User successfully created!");
        this.handleCloseModal();
      })
      .catch(e => {
        this.createMessage("danger", "User already exists.");
        this.handleCloseModal();
      });
  };

  removeUser = user_id => {
    axios
      .delete(`${process.env.REACT_APP_USERS_SERVICE_URL}/users/${user_id}`)
      .then(res => {
        this.getUsers();
        this.createMessage("success", "User removed.");
      })
      .catch(err => {
        console.error(err);
        this.createMessage("danger", "Something went wrong.");
      });
  };

  isAuthenticated() {
    const token = window.localStorage.getItem("authToken");
    if (token) {
      const options = {
        url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
        method: "get",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      };
      return axios(options)
        .then(res => {
          return true;
        })
        .catch(err => {
          return false;
        });
    } else {
      return false;
    }
  }

  handleRegisterFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then(res => {
        window.localStorage.setItem("authToken", res.data.auth_token);
        this.getUsers();
        this.createMessage("success", "You have registered successfully!");
      })
      .catch(e => {
        console.error(e);
        this.createMessage("danger", "User already exists.");
      });
  };

  handleLoginFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then(res => {
        window.localStorage.setItem("authToken", res.data.auth_token);
        this.getUsers();
        this.createMessage("success", "You have logged in successfully!");
      })
      .catch(e => {
        console.error(e);
        this.createMessage("danger", "Incorrect email and/or password.");
      });
  };

  logoutUser = () => {
    window.localStorage.removeItem("authToken");
    this.props.history.push("/");
    this.createMessage("success", "You have successfully logged out.");
  };

  handleOpenModal = () => {
    this.setState({ showModal: true });
  };
  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, title } = this.state;
    return (
      <div>
        <Nav
          title={title}
          logout={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />
        <section className="section">
          <div className="container">
            {this.state.messageType && this.state.messageText && (
              <Message
                messageType={this.state.messageType}
                messageText={this.state.messageText}
                removeMessage={this.removeMessage}
              />
            )}
            <div className="columns">
              <div className="column is-half">
                <Switch>
                  <Route
                    exact
                    path="/"
                    render={() => (
                      <div>
                        <br />
                        <h1 className="is-1 title">Wakemaps Users</h1>
                        <hr />
                        <br />
                        <button
                          onClick={this.handleOpenModal}
                          className="button is-primary"
                        >
                          Add User
                        </button>
                        <br />
                        <br />
                        <Modal
                          isOpen={this.state.showModal}
                          style={modalStyles}
                        >
                          <div className="modal is-active">
                            <div className="modal-background" />
                            <div className="modal-card">
                              <header className="modal-card-head">
                                <p className="modal-card-title">Add User</p>
                                <button
                                  className="delete"
                                  aria-label="close"
                                  onClick={this.handleCloseModal}
                                />
                              </header>
                              <section className="modal-card-body">
                                <AddUser addUser={this.addUser} />
                              </section>
                            </div>
                          </div>
                        </Modal>
                        <Users users={users} removeUser={this.removeUser} />
                      </div>
                    )}
                  />
                  <Route exact path="/about" component={About} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <RegisterForm
                        handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => (
                      <LoginForm
                        handleLoginFormSubmit={this.handleLoginFormSubmit}
                        isAuthenticated={this.isAuthenticated}
                      />
                    )}
                  />
                  <Route
                    exact
                    path="/status"
                    render={() => (
                      <UserStatus isAuthenticated={this.isAuthenticated} />
                    )}
                  />
                </Switch>
              </div>
            </div>
          </div>
        </section>
      </div>
    );
  }
}

export default withRouter(App);
