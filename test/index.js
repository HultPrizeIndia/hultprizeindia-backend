// setting the env variable to handle DB connection
process.env.NODE_ENV = 'test';

// Import server files
const connection = require('../utils/connection');
const server = require('../index');

// Run tests once the connection to DB has been made.
before((done) => {
    connection.connect().then(() => {
        done();
    });
});


after((done) => {
    server.close(() => {
        console.log("Closing API server");
        connection.close()
        .then(() => {
            console.log("Closing TestDB server");
            done();
        }).catch(err => done(err));
    });
});