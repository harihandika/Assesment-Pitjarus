'use strict';
module.exports = (db, DataTypes) => {
    return db.define("report_product", {
        report_id: {
            type: DataTypes.INTEGER,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        store_id: {
            type: DataTypes.INTEGER,
        },
        product_id: DataTypes.INTEGER,
        compliance: DataTypes.INTEGER,
        tanggal: DataTypes.DATE,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}