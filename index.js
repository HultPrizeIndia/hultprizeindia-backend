require('dotenv').config();
// External Libraries
const express = require('express');

// Inbuilt Libraries
const fs = require('fs');
const path = require('path');

// Custom Libraries
const RequestError = require('./models/request-error');
const connection = require('./utils/connection');

// Routes
const adminRoutes = require('./routes/admin-routes');
const taskRoutes = require('./routes/task-routes');
const referralRoutes = require('./routes/referral-routes');
const liveRoutes = require('./routes/live-routes');
const universityRoutes = require('./routes/university-routes');
const campusDirectorRoutes = require('./routes/campus-director-routes');
const queryRoutes = require('./routes/query-routes');


// Setup server:
const app = express();
app.use(express.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

// Handle File upload:
app.use('/uploads/images', express.static(path.join('uploads', 'images')));

// added test commit --faltu hai yeh

// Setup Routes:
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/campusDirector', campusDirectorRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/referral', referralRoutes);
app.use('/api/v1/query', queryRoutes);
app.use('/api/v1/university', universityRoutes);
app.use('/api/v1/live', liveRoutes);

// Unsupported Routes.
app.use((req, res, next) => {
    throw new RequestError('Could not find this route.', 404);
});

// Error Handling
app.use((error, req, res, next) => {
    if (req.file) {
        fs.unlink(req.file.path, err => {
            console.log(err);
        });
    }
    if (res.headersSent) {
        return next(error);
    }
    res.status(error.code || 500);
    res.json({
        "status": "failed",
        "message": error.message || 'An unknown error occurred!'
    });
});


const server = app.listen(process.env.SV_PORT, async () => {
    console.log(`\n${process.env.APP_NAME} Started\nListening on port: ${process.env.SV_PORT}`);
    await connection.connect();
});


// exports.server = server;
module.exports = server;