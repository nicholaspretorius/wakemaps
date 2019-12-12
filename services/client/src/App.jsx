import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";
import axios from "axios";

import Users from "./components/Users";
import AddUser from "./components/AddUser";
import About from "./components/About";
import Nav from "./components/Nav";

class App extends Component {
  state = {
    users: [],
    username: "",
    email: "",
    title: "Wakemaps"
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
    const { users, username, email, title } = this.state;
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
      </div>
    );
  }
}

export default App;