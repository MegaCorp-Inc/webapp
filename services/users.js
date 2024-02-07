const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const checkFields = (fields) => {
  let message = "Missing/Invalid:";
  if (!fields.first_name || fields.first_name.length < 1) message += " First Name ";
  if (!fields.last_name || fields.last_name.length < 1) message += " Last Name ";
  if (!fields.username || !emailRegex.test(fields.username))
    message += " Username ";
  if (!fields.password || fields.password.length < 8) message += " Password ";

  if (message === "Missing/Invalid:") return "Valid";
  return message.trim() + " field(s)!";
};

const checkFieldsPresent = (fields) => {
  if (fields["username"]) return "Username cannot be updated!";
  if (!fields["first_name"] && !fields["last_name"] && !fields["password"]) {
    return "Missing required fields!";
  }
  return "Valid";
};

module.exports = { checkFields, checkFieldsPresent };
