const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

// Endpoint to submit review
router.post('/', async (req, res) => {
    const { studentName, admissionNo, branchSemester, teacherName, teacherSubject, teacherDepartment, ratings, suggestions, overallEvaluation } = req.body;

    try {
        const newReview = new Review({
            studentName,
            admissionNo,
            branchSemester,
            teacherName,
            teacherSubject,
            teacherDepartment,
            ratings,
            suggestions,
            overallEvaluation
        });

        await newReview.save();
        res.json({ message: 'Review submitted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to submit review' });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find();
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Endpoint to get reviews for a specific teacher
router.post('/filter', async (req, res) => {
    const { teacherName, teacherDepartment, branchSemester } = req.body;

    try {
        const reviews = await Review.find({
            teacherName,
            teacherDepartment,
            branchSemester
        });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Get reviews by faculty name and department
router.get('/faculty/:name/:department', async (req, res) => {
    try {
        const { name, department } = req.params;
        const reviews = await Review.find({
            teacherName: name,
            teacherDepartment: department
        });
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
});

// Update review
router.put('/:id', async (req, res) => {
    try {
        const { studentName, admissionNo, branchSemester, teacherName, teacherSubject, teacherDepartment, ratings, suggestions, overallEvaluation } = req.body;
        
        const updatedReview = await Review.findByIdAndUpdate(
            req.params.id,
            {
                studentName,
                admissionNo,
                branchSemester,
                teacherName,
                teacherSubject,
                teacherDepartment,
                ratings,
                suggestions,
                overallEvaluation
            },
            { new: true, runValidators: true }
        );

        if (!updatedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ message: 'Review updated successfully', review: updatedReview });
    } catch (error) {
        console.error('Error updating review:', error);
        res.status(500).json({ error: 'Failed to update review' });
    }
});

// Delete review
router.delete('/:id', async (req, res) => {
    try {
        const deletedReview = await Review.findByIdAndDelete(req.params.id);
        
        if (!deletedReview) {
            return res.status(404).json({ error: 'Review not found' });
        }

        res.json({ message: 'Review deleted successfully' });
    } catch (error) {
        console.error('Error deleting review:', error);
        res.status(500).json({ error: 'Failed to delete review' });
    }
});

module.exports = router;
