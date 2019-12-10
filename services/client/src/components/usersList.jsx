import React from "react";

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

export default UsersList;
