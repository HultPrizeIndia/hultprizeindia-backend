const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const adminRoutes = require('./routes/admin-routes');
const taskRoutes = require('./routes/task-routes');
const liveRoutes = require('./routes/live-routes');
const universityRoutes = require('./routes/university-routes');
const campusDirectorRoutes = require('./routes/campus-director-routes');

const RequestError = require('./models/request-error');

const app = express();

const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

    next();
});

app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/campusDirector', campusDirectorRoutes);
app.use('/api/v1/task',taskRoutes);
app.use('/api/v1/university',universityRoutes);
app.use('/api/v1/live',liveRoutes);

app.use((req, res, next) => {
    throw new RequestError('Could not find this route.', 404);
});

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
    res.json({message: error.message || 'An unknown error occurred!'});
});

mongoose
    .connect(
        `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-dhan1.gcp.mongodb.net/${process.env.DB_Name}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true
        }
    )
    .then(() => {
        app.listen(PORT, () => {
            console.log(`DB connected at : mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0-dhan1.gcp.mongodb.net/${process.env.DB_Name} on port: ${PORT}`);
        });
    })
    .catch(err => {
        console.log(err);
    });