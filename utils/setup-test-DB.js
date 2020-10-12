const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');
const CampusDirector = require('../models/campus-director');

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
            process.env.JWT_KEY, {
                expiresIn: '2d' // expires in 2d
            }
        );
        adminToken = jwt.sign(
            {userId: admin.id, email: admin.email},
            process.env.JWT_KEY, {
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

exports.setupTestDB = setupTestDB;
