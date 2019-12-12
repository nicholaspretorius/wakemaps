import React, { Component } from "react";
import axios from "axios";

class UserStatus extends Component {
  state = {
    id: "",
    email: "",
    username: ""
  };

  componentDidMount() {
    this.getUserStatus();
  }

  getUserStatus(event) {
    const options = {
      url: `${process.env.REACT_APP_USERS_SERVICE_URL}/auth/status`,
      method: "get",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${window.localStorage.authToken}`
      }
    };
    return axios(options)
      .then(res => {
        console.log(res.data.data);
        this.setState({
          id: res.data.data.id,
          email: res.data.data.email,
          username: res.data.data.username
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  render() {
    const { id, email, username } = this.state;
    return (
      <div>
        <ul>
          <li>
            <strong>User ID: </strong> <span data-testid="user-id">{id}</span>
          </li>
          <li>
            <strong>Username: </strong> <span data-testid="user-username">{username}</span>
          </li>
          <li>
            <strong>Email: </strong> <span data-testid="user-email">{email}</span>
          </li>
        </ul>
      </div>
    );
  }
}

export default UserStatus;
