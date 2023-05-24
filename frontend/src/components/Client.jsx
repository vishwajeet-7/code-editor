import React from "react";
import Avatar from "react-avatar";

const Client = ({ client }) => {
  return (
    <div className="client">
      <Avatar name={client} size="50" round="14px" />
      <span className="username">{client}</span>
    </div>
  );
};

export default Client;
