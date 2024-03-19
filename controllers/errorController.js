const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}`;
    return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
    const value = Object.values(error.keyValue[0]);
    const message = `Duplicate fields: ${value}. Please use another value`;
    return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors).map(el => el.message);
    const message = `Invalid input data: ${errors.join(', ')}`;
    return new AppError(message, 400);
};

const sendDevError = (res, err) => {
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        error: err,
        stack: err.stack,
    });
};

const sendProdError = (res, err) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    } else {
        res.status(500).json({
            status: 'Error',
            message: 'Something is wrong!',
        });
    }
};

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || '500';
    err.status = err.status || 'Error';

    if (process.env.NODE_ENV === 'development') {
        sendDevError(res, err);
    }

    if (process.env.NODE_ENV === 'production') {
        sendProdError(res, err);

        if (err.name === 'CastError') {
            err = handleCastErrorDB(err);
        }

        if (err.code === 11000) {
            err = handleDuplicateFieldsDB(err);
        }

        if (err.name === 'ValidationError') {
            err = handleValidationErrorDB(err);
        }
    }
};
