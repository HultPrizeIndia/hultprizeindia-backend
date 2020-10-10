const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');

function connect() {
  return new Promise((resolve, reject) => {

    if (process.env.NODE_ENV === 'test') {
        const mongod = new MongoMemoryServer();
        mongod.getUri().then(uri => {
            mongod.getDbName().then( dbName => {
                mongoose.connect(uri, {
                    useNewUrlParser: true, 
                    useUnifiedTopology: true, 
                    useCreateIndex: true,
                    useFindAndModify: false
                }).then((res, err) => {
                    if (err) {
                        console.log(`Error occured while connecting to database: ${uri}`)
                        console.log(err);
                        return reject(err);
                    }
                    console.log(`Connected to TestDB at ${uri} \nUsing DB: ${dbName}`);
                    resolve();
                });
            })
        });
        
    } else {
        mongoose.connect(`${process.env.DB_URL}`, {
            useNewUrlParser: true, 
            useUnifiedTopology: true, 
            useCreateIndex: true,
            useFindAndModify: false
        }).then((res, err) => {
            if (err) {
                console.log(`Error occured while connecting to database: ${process.env.DB_URL}`)
                console.log(err);
                return reject(err);
            }
            console.log(`Connected to DB at ${process.env.DB_URL} \nUsing DB: ${process.env.DB_Name}`);
            resolve();
        });
    }
  });
}

function close() {
  return mongoose.disconnect();
}

// function dropAll() {
//     if (process.env.NODE_ENV === 'test') {
//         const collections = mongoose.connection.db.collections().then(() => {
//             for (let collection of collections) {
//                 collection.deleteMany({});
//            }
//         }).catch(err => console.log(err));
        
//     }
// }

module.exports = { connect, close };