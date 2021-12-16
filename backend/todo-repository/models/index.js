'use strict';
require('dotenv').config();
var fs = require('fs');
var path = require('path');
var Sequelize = require('sequelize');
var basename = path.basename(__filename);
var db = {};
const { Op } = Sequelize;

console.log("DB_NAME : ", process.env.DB_NAME)

const connect = async () => {
  var sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    logging: false,
    dialectOptions: {
      useUTC: true,
      dateStrings: true,
      typeCast: true,
    },
    operatorsAliases: {
      $and: Op.and,
      $or: Op.or,
      $eq: Op.eq,
      $ne: Op.ne,
      $is: Op.is,
      $isNot: Op.not,
      $col: Op.col,
      $gt: Op.gt,
      $gte: Op.gte,
      $lt: Op.lt,
      $lte: Op.lte,
      $between: Op.between,
      $notBetween: Op.notBetween,
      $all: Op.all,
      $in: Op.in,
      $notIn: Op.notIn,
      $like: Op.like,
      $iLike: Op.iLike,
      $notLike: Op.notLike,
    },
  });
  // var sequelize = new Sequelize('todo', 'postgres', '.9^Piv-.KlzZhZm.MU7vXZU7yE9I-4', {
  //   dialect: 'postgres',
  //   host: 'cgl-dev-db.ccyrpfjhgi1v.ap-southeast-1.rds.amazonaws.com',
  //   port: 5432,
  //   logging: false,
  //   dialectOptions: {
  //     useUTC: true,
  //     dateStrings: true,
  //     typeCast: true,
  //   },
  //   operatorsAliases: {
  //     $and: Op.and,
  //     $or: Op.or,
  //     $eq: Op.eq,
  //     $ne: Op.ne,
  //     $is: Op.is,
  //     $isNot: Op.not,
  //     $col: Op.col,
  //     $gt: Op.gt,
  //     $gte: Op.gte,
  //     $lt: Op.lt,
  //     $lte: Op.lte,
  //     $between: Op.between,
  //     $notBetween: Op.notBetween,
  //     $all: Op.all,
  //     $in: Op.in,
  //     $notIn: Op.notIn,
  //     $like: Op.like,
  //     $iLike: Op.iLike,
  //     $notLike: Op.notLike,
  //   },
  // });

  fs.readdirSync(__dirname)
    .filter((file) => {
      return file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js';
    })
    .forEach((file) => {
      var model = sequelize['import'](path.join(__dirname, file));
      db[model.name] = model;
    });

  Object.keys(db).forEach((modelName) => {
     /* istanbul ignore next */
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.sequelize = sequelize;

  return db;
};

module.exports = connect();
