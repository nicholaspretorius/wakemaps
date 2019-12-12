import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import Users from "./components/Users";
import AddUser from "./components/AddUser";
import About from "./components/About";
import Nav from "./components/Nav";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";

class App extends Component {
  state = {
    users: [],
    title: "Wakemaps"
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

  addUser = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/users`;
    axios
      .post(url, data)
      .then(res => {
        // console.log(res);
        this.getUsers();
        this.setState({ username: "", email: "" });
      })
      .catch(e => {
        // console.log(e);
      });
  };

  handleRegisterFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/register`;
    axios
      .post(url, data)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.error(e);
      });
  };

  handleLoginFormSubmit = data => {
    const url = `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/login`;
    axios
      .post(url, data)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.error(e);
      });
  };

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, title } = this.state;
    return (
      <div>
        <Nav title={title} />
        <section className="section">
          <div className="container">
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
                        <AddUser addUser={this.addUser} />
                        <hr />
                        <br />
                        <Users users={users} />
                      </div>
                    )}
                  />
                  <Route exact path="/about" component={About} />
                  <Route
                    exact
                    path="/register"
                    render={() => (
                      <RegisterForm handleRegisterFormSubmit={this.handleRegisterFormSubmit} />
                    )}
                  />
                  <Route
                    exact
                    path="/login"
                    render={() => <LoginForm handleLoginFormSubmit={this.handleLoginFormSubmit} />}
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

export default App;
