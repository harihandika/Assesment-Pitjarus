'use strict';
module.exports = (db, DataTypes) => {
    return db.define("store_area", {
        area_id: {
            type: DataTypes.INTEGER,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        area_name: {
            type: DataTypes.STRING,
        }
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}