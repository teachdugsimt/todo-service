const InternalSequelizeError = require("../src/InternalSequelizeError");

describe("TEST Internal Sequelize Error For Repository", () => {
  test("Should be return error message when new class", async () => {
    const entity = "SomeRepository";
    const functionName = "logFunction";
    const error = {
      name: "SERVER_ERROR",
    };

    const expectedValue = {
      status: 500,
      name: "SERVER_ERROR",
      errorMessage: "SomeRepository error: logFunction function",
    };
    const result = new InternalSequelizeError(entity, functionName, error);

    expect(result).toMatchObject(expectedValue);
  });
});
