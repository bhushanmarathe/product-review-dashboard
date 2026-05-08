const express = require("express");
const router = express.Router();
const {
  getProductsPerCategory,
  getTopReviewedProducts,
  getDiscountDistribution,
  getCategoryAverageRating,
} = require("../controllers/analyticsController");

router.get("/products-per-category", getProductsPerCategory);
router.get("/top-reviewed-products", getTopReviewedProducts);
router.get("/discount-distribution", getDiscountDistribution);
router.get("/category-average-rating", getCategoryAverageRating);

module.exports = router;
