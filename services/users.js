const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

const checkFields = (fields) => {
  let message = "Missing/Invalid:";
  if (!fields.first_name) message += " First Name ";
  if (!fields.last_name) message += " Last Name ";
  if (!fields.username || !emailRegex.test(fields.username))
    message += " Username ";
  if (!fields.password) message += " Password ";

  if (message === "Missing/Invalid:") return "Valid";
  return message.trim() + " field(s)!";
};

module.exports = checkFields;
