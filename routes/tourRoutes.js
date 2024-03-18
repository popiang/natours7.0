const express = require('express');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
    .route('/top5cheap')
    .get(tourController.getTop5CheapTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);

router.route('/get-monthly-plan/:year').get(tourController.getMonthlyPlan);

router
    .route('/')
    .get(tourController.getAllTours)
    .post(tourController.createATour);

router
    .route('/:id')
    .get(tourController.getTourById)
    .patch(tourController.updateATour)
    .delete(tourController.deleteATour);

module.exports = router;
