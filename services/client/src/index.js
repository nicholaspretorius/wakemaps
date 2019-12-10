import React, { Component } from "react";
import ReactDOM from "react-dom";
import axios from "axios";

import UsersList from "./components/UsersList";
import AddUser from "./components/AddUser";

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
      .catch(e => console.error(e));
  }

  addUser = event => {
    event.preventDefault();
    console.log("Sanity Check! ", this.state);
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
              <br />
              <h1 className="title is-1">Users</h1>
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
              <UsersList users={users} />
            </div>
          </div>
        </div>
      </section>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("root"));
