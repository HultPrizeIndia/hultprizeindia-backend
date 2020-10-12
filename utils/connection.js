const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const {setupTestDB} = require('./setup-test-DB');

const connect = () => {
    return new Promise((resolve, reject) => {
        // Ignoring else because it is reached then running in prod/dev
        /* istanbul ignore else */
        if (process.env.NODE_ENV === 'test') {
            const mongod = new MongoMemoryServer();
            mongod.getUri().then(uri => {
                mongod.getDbName().then(dbName => {
                    mongoose.connect(uri, {
                        useNewUrlParser: true,
                        useUnifiedTopology: true,
                        useCreateIndex: true,
                        useFindAndModify: false
                    }).then((res, err) => {
                        /* istanbul ignore if */
                        if (err) {
                            console.log(`Error occurred while connecting to database: ${uri}`)
                            console.log(err);
                            return reject(err);
                        }
                        console.log(`Connected to TestDB at ${uri} \nUsing DB: ${dbName}\n\n`);
                        setupTestDB();
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
                console.log(`Connected to DB at ${process.env.DB_URL} \nUsing DB: ${process.env.DB_NAME}\n\n`);
                resolve();
            });
        }
    });
}

const close = () => {
    return mongoose.disconnect();
}


// const dropAll = () => {
//     if (process.env.NODE_ENV === 'test') {
//         const collections = mongoose.connection.db.collections().then(() => {
//             for (let collection of collections) {
//                 collection.deleteMany({});
//            }
//         }).catch(err => console.log(err));

//     }
// }

module.exports = {connect, close};