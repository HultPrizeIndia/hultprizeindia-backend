const mongoose = require('mongoose');
const {MongoMemoryServer} = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const CampusDirector = require('../models/campus-director');
// const Query = require('../models/query');
// const Referral = require('../models/referral');
// const Task = require('../models/task');
// const University = require('../models/university');

const connect = () => {
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
            console.log(`Connected to DB at ${process.env.DB_URL} \nUsing DB: ${process.env.DB_Name}\n\n`);
            resolve();
        });
    }
  });
}

const close = () => {
  return mongoose.disconnect();
}

const setupTestDB = () => {
    const cd = new CampusDirector({
        firstName: "test",
        lastName: "user",
        email: "test@user.com",
        // image: {type: String},
        password: "test123",
        // university: {type: mongoose.Types.ObjectId, ref: 'University'},
        mobile: "1234567890",
        joinDate: Date().toLocaleString()
    });
    const admin = new Admin({
        firstName: "testAdmin",
        lastName: "user",
        email: "test@Admin.com",
        // image: {type: String},
        password: "test123",
        // university: {type: mongoose.Types.ObjectId, ref: 'University'},
        mobile: "1234567890",
        joinDate: Date().toLocaleString()
    });

    try {
         cd.save();
         admin.save();
    } catch (err) {
        throw Error(`Error creating dummy users in TestDB: ${err}`);
    }
    let cdToken;
    let adminToken;
    try {
        cdToken = jwt.sign(
            {userId: cd.id, email: cd.email},
            process.env.Jwt_Key, {
                expiresIn: '2d' // expires in 2d
            }
        );
        adminToken = jwt.sign(
            {userId: admin.id, email: admin.email},
            process.env.Jwt_Key, {
                expiresIn: '2d' // expires in 2d
            }
        );
    } catch (err) {
        throw Error(`Error creating dummy user token in TestDB: ${err}`);
    }
    process.env.TEST_ADMIN_TOKEN = adminToken;
    process.env.TEST_CD_TOKEN = cdToken;
    console.log("\nCreated dummy testDB data successfully!");
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

module.exports = { connect, close };