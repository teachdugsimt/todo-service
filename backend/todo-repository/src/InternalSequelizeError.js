"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class InternalSequelizeError {
  constructor(entity, functionName, error) {
    const resultError = JSON.parse(JSON.stringify(error));
    let response = {
      status: 500,
      name: resultError.name,
      errorMessage: `${entity} error: ${functionName} function`,
      details: resultError.errors,
    };
    Object.assign(this, response);
  }
}

module.exports = InternalSequelizeError;
