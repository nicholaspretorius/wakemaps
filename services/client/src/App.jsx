import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import Users from "./components/Users";
import AddUser from "./components/AddUser";
import About from "./components/About";

class App extends Component {
  state = {
    users: [],
    username: "",
    email: ""
  };

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => this.setState({ users: res.data.data.users }))
      .catch(e => {
        // console.log(e);
      });
  }

  addUser = event => {
    event.preventDefault();
    // console.log("Sanity Check! ", this.state);
    const data = {
      username: this.state.username,
      email: this.state.email
    };

    axios
      .post(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`, data)
      .then(res => {
        // console.log(res);
        this.getUsers();
        this.setState({ username: "", email: "" });
      })
      .catch(e => {
        // console.log(e);
      });
  };

  handleChange = event => {
    const obj = {};
    obj[event.target.name] = event.target.value;
    this.setState(obj);
  };

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users, username, email } = this.state;
    return (
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
                      <AddUser
                        username={username}
                        email={email}
                        addUser={this.addUser}
                        handleChange={this.handleChange}
                      />
                      <hr />
                      <br />
                      <Users users={users} />
                    </div>
                  )}
                />
                <Route exact path="/about" component={About} />
              </Switch>
            </div>
          </div>
        </div>
      </section>
    );
  }
}

export default App;
