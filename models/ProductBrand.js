
'use strict';

module.exports = (db, DataTypes) => {
    return db.define("product_brand", {
        brand_id: {
            allowNull: false,
            // defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            type: DataTypes.INTEGER,
        },
        brand_name: DataTypes.STRING,
    }, {
        freezeTableName: true,
        timestamps: false,
    });
}