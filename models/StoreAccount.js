'use strict';
module.exports = (db, DataTypes) => {
    return db.define("store_account", {
        account_id: {
            type: DataTypes.INTEGER,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        account_name: {
            type: DataTypes.STRING,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}