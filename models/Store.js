'use strict';
module.exports = (db, DataTypes) => {
    return db.define("store", {
        store_id: {
            type: DataTypes.INTEGER,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        store_name: {
            type: DataTypes.STRING,
        },
        account_id: DataTypes.INTEGER,
        area_id: DataTypes.INTEGER,
        is_active: DataTypes.INTEGER,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}