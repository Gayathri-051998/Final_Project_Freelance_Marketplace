const Review = require('../models/Review');

exports.createReview = async (req, res) => {
  try {
    const review = await Review.create({ ...req.body, reviewer: req.user._id });
    res.status(201).json(review);
  } catch (err) {
    res.status(400).json({ message: 'Failed to add review', error: err.message });
  }
};

exports.getReviewsForUser = async (req, res) => {
  const reviews = await Review.find({ reviewedUser: req.params.userId }).populate('reviewer');
  res.json(reviews);
};


