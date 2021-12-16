const model = (Sequelize, DataTypes) => {
    const todo = Sequelize.define(
      "todo",
      {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        title: {
          type: DataTypes.STRING,
        },
        status: {
          type: DataTypes.ENUM("PENDING", "COMPLETED"),
        },
        created_at: {
          type: "TIMESTAMPTZ",
          defaultValue: DataTypes.NOW,
        },
        updated_at: {
          type: "TIMESTAMPTZ",
          defaultValue: DataTypes.NOW,
          onUpdate: DataTypes.NOW,
        },
      },
      {
        tableName: "todo",
        freezeTableName: true,
        timestamps: true,
        createdAt: false,
        updatedAt: false,
      }
    );
  
    return todo;
  };
  
  module.exports = model;
  