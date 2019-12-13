import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";
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
    const { isAuthenticated } = this.props;

    if (!isAuthenticated()) {
      return <Redirect to="/login" />;
    } else {
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
}

UserStatus.propTypes = {
  isAuthenticated: PropTypes.func.isRequired
};

export default UserStatus;
