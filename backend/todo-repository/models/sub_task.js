const model = (Sequelize, DataTypes) => {
    const sub_task = Sequelize.define(
        "sub_task",
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            todoId: {
                type: DataTypes.INTEGER,
                field: 'todo_id'
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
            tableName: "sub_task",
            freezeTableName: true,
            timestamps: true,
            createdAt: false,
            updatedAt: false,
        }
    );

    return sub_task;
};

module.exports = model;
