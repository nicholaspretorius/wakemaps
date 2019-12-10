import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import UsersList from "./components/usersList";

class App extends Component {
  state = {
    users: []
  };

  getUsers() {
    axios
      .get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
      .then(res => this.setState({ users: res.data.data.users }))
      .catch(e => console.error(e));
  }

  componentDidMount() {
    this.getUsers();
  }

  render() {
    const { users } = this.state;
    return (
      <section className="section">
        <div className="container">
          <div className="columns">
            <div className="column is-one-third">
              <br />
              <h1 className="title is-1">Users</h1>
              <hr />
              <br />
              <UsersList users={users} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
