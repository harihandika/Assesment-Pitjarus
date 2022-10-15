require('dotenv').config();
const {
    MYSQL_USER,
    MYSQL_DBNAME,
    DIALECT,
    MYSQL_PASSWORD,
    MYSQL_HOST,
} = process.env;


module.exports = {
    "development": {
        "username": MYSQL_USER,
        "password": MYSQL_PASSWORD,
        "database": MYSQL_DBNAME,
        "host": MYSQL_HOST,
        "dialect": DIALECT || "mysql",
        timezone: '+07:00',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
        // timezone: '+05:30', // for writing to database
    },
    "production": {
        "username": MYSQL_USER,
        "password": MYSQL_PASSWORD,
        "database": MYSQL_DBNAME,
        "host": MYSQL_HOST,
        "dialect": DIALECT || "mysql",
        timezone: '+07:00',
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },
}

