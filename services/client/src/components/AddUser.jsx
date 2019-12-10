import React from "react";

const AddUser = props => {
  const { addUser, handleChange, username, email } = props;
  return (
    <form onSubmit={e => addUser(e)}>
      <div className="field">
        <label className="label is-large" htmlFor="input-username">
          Username
        </label>
        <input
          name="username"
          id="input-username"
          value={username}
          onChange={handleChange}
          className="input is-large"
          type="text"
          placeholder="Enter a username"
          required
        />
      </div>
      <div className="field">
        <label className="label is-large" htmlFor="input-email">
          Email
        </label>
        <input
          name="email"
          id="input-email"
          value={email}
          onChange={handleChange}
          className="input is-large"
          type="email"
          placeholder="Enter an email address"
          required
        />
      </div>

      <input type="submit" className="button is-primary is-large is-fullwidth" value="Submit" />
    </form>
  );
};

export default AddUser;
