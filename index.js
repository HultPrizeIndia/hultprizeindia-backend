// External Libraries
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Inbuilt Libraries
const fs = require('fs');
const path = require('path');

// Custom Libraries
const RequestError = require('./models/request-error');

// Routes
const adminRoutes = require('./routes/admin-routes');
const taskRoutes = require('./routes/task-routes');
const liveRoutes = require('./routes/live-routes');
const universityRoutes = require('./routes/university-routes');
const campusDirectorRoutes = require('./routes/campus-director-routes');



// Setup server:
const app = express();
app.use(bodyParser.json());
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


// Setup Routes:
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/campusDirector', campusDirectorRoutes);
app.use('/api/v1/task',taskRoutes);
app.use('/api/v1/university',universityRoutes);
app.use('/api/v1/live',liveRoutes);


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

mongoose.connect(`${process.env.DB_URL}`, {
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    useCreateIndex: true
}).then(() => {
        app.listen(process.env.SV_PORT, () => {
            console.log(`\n${process.env.APP_NAME} Started\nListening on port: ${process.env.SV_PORT}`);
            console.log(`Connected to DB at ${process.env.DB_URL} \nUsing DB: ${process.env.DB_Name}`);
        });
    }).catch(err => {
        console.log(`Error occured while connecting to database: ${process.env.DB_URL}`)
        console.log(err);
    });