import React from "react";
import { PropTypes } from "prop-types";

const UsersList = props => {
  const { users } = props;
  return (
    <div>
      {users.map(user => (
        <p key={user.id} className="box title is-4 username">
          {user.username}
        </p>
      ))}
    </div>
  );
};

UsersList.propTypes = {
  users: PropTypes.array.isRequired
};

export default UsersList;
