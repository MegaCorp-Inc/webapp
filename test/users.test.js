const { describe } = require("mocha");
const app = require("../app");
const { checkFields, checkFieldsPresent } = require("../services/users");
const request = require("supertest");
const { assert, expect } = require("chai");

const user = {
  first_name: "Piyush",
  last_name: "Dongre",
  username: "dongrep@northeastern.edu",
  password: "asdf@123",
};

describe("CREATE USER AND RETRIEVE", () => {
  it("Checks if user object is valid", () => {
    const result = checkFields(user);
    assert.equal(result, "Valid");
  });
  it("Checks if user object fields are invalid", () => {
    const result = checkFields({
      first_name: "",
      last_name: "",
      username: "",
      password: "",
    });
    assert.equal(
      result,
      "Missing/Invalid: First Name  Last Name  Username  Password field(s)!",
    );
  });
  it("Checks if user object is being created", (done) => {
    request(app)
      .post("/v2/user")
      .send(user)
      .end((err, res) => {
        assert.equal(res.status, 201);
        expect(res.body).to.have.property("id");
        expect(res.body)
          .to.have.property("first_name")
          .and.is.equal(user.first_name);
        expect(res.body)
          .to.have.property("last_name")
          .and.is.equal(user.last_name);
        expect(res.body)
          .to.have.property("username")
          .and.is.equal(user.username);
        expect(res.body).to.have.property("account_created");
        expect(res.body).to.have.property("account_updated");
        done();
      });
  });
  it("Checks if a duplicate user object is being created", (done) => {
    request(app)
      .post("/v2/user")
      .send(user)
      .end((err, res) => {
        assert.equal(res.status, 409);
        done();
      });
  });
  it("Checks if user object was created", (done) => {
    request(app)
      .get("/v2/user/self")
      .set(
        "Authorization",
        "Basic " +
          Buffer.from(user.username + ":" + user.password).toString("base64"),
      )
      .end((err, res) => {
        assert.equal(res.status, 200);
        expect(res.body).to.have.property("id");
        expect(res.body)
          .to.have.property("first_name")
          .and.is.equal(user.first_name);
        expect(res.body)
          .to.have.property("last_name")
          .and.is.equal(user.last_name);
        expect(res.body)
          .to.have.property("username")
          .and.is.equal(user.username);
        expect(res.body).to.have.property("account_created");
        expect(res.body).to.have.property("account_updated");
        done();
      });
  });
});

describe("UPDATE AND GET USER", () => {
  const updatedName = "Push";
  it("Checks if update object fields has username", () => {
    const result = checkFieldsPresent({
      username: "asdf"
    });
    assert.equal(
      result,
      "Username cannot be updated!",
    );
  });
  it("Checks if update object fields are invalid", () => {
    const result = checkFieldsPresent({
      first_name: "",
      last_name: "",
      password: "",
    });
    assert.equal(
      result,
      "Missing required fields!",
    );
  });
  it("Checks if update object fields are invalid, and sends 400 response", () => {
    request(app)
      .put("/v2/user/self")
      .set(
        "Authorization",
        "Basic " +
          Buffer.from(user.username + ":" + user.password).toString("base64"),
      ).send({ first_name: "" })
      .end((err, res) => {
        assert.equal(res.status, 400);
      });
  });
  it("Checks if user object is being updated", (done) => {
    request(app)
      .put("/v2/user/self")
      .set(
        "Authorization",
        "Basic " +
          Buffer.from(user.username + ":" + user.password).toString("base64"),
      )
      .send({ first_name: updatedName })
      .end((err, res) => {
        assert.equal(res.status, 204);
        done();
      });
  });

  it("Checks if user object was updated to expected value", (done) => {
    request(app)
      .get("/v2/user/self")
      .set(
        "Authorization",
        "Basic " +
          Buffer.from(user.username + ":" + user.password).toString("base64"),
      )
      .end((err, res) => {
        assert.equal(res.status, 200);
        expect(res.body).to.have.property("id");
        expect(res.body)
          .to.have.property("first_name")
          .and.is.equal(updatedName);
        expect(res.body)
          .to.have.property("last_name")
          .and.is.equal(user.last_name);
        expect(res.body)
          .to.have.property("username")
          .and.is.equal(user.username);
        expect(res.body).to.have.property("account_created");
        expect(res.body).to.have.property("account_updated");
        done();
      });
  });
});
