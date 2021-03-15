const {Client} = require("pg");
// const types = Client.types;
// types.setTypeParser(1114, function(stringValue) {
//     return stringValue;
// });

let DB_URI;

if (process.env.NODE_ENV === "test") {
    DB_URI = "postgresql:///biztime_test";
} else {
    DB_URI = "postgresql:///biztime";
}

let db = new Client({
    connectionString: DB_URI
});

db.connect();

module.exports = db;

