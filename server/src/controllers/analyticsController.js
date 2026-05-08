const { Product, Review } = require("../models"); // Now from index.js
const { Op } = require("sequelize");

exports.getProductsPerCategory = async (req, res) => {
  try {
    const result = await Product.findAll({
      attributes: [
        "category",
        [
          Product.sequelize.fn("COUNT", Product.sequelize.col("product_id")),
          "count",
        ],
      ],
      where: { category: { [Op.ne]: null } },
      group: ["category"],
      order: [[Product.sequelize.col("count"), "DESC"]],
      raw: true,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTopReviewedProducts = async (req, res) => {
  try {
    const result = await Product.findAll({
      attributes: [
        "product_name",
        [
          Product.sequelize.fn(
            "COALESCE",
            Product.sequelize.col("rating_count"),
            0,
          ),
          "rating_count",
        ],
      ],
      where: {
        rating_count: { [Op.gt]: 0 },
      },
      order: [[Product.sequelize.col("rating_count"), "DESC"]],
      limit: 10,
      raw: true,
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDiscountDistribution = async (req, res) => {
  try {
    const rangeCase = `
      CASE
        WHEN "discount_percentage" IS NULL OR "discount_percentage" < 10 THEN '0-10'
        WHEN "discount_percentage" < 20 THEN '10-20'
        WHEN "discount_percentage" < 30 THEN '20-30'
        WHEN "discount_percentage" < 40 THEN '30-40'
        WHEN "discount_percentage" < 50 THEN '40-50'
        WHEN "discount_percentage" < 60 THEN '50-60'
        WHEN "discount_percentage" < 70 THEN '60-70'
        WHEN "discount_percentage" < 80 THEN '70-80'
        WHEN "discount_percentage" < 90 THEN '80-90'
        ELSE '90+'
      END
    `;

    const result = await Product.findAll({
      attributes: [
        [Product.sequelize.literal(rangeCase), "range"],
        [
          Product.sequelize.fn("COUNT", Product.sequelize.col("product_id")),
          "count",
        ],
      ],
      group: [Product.sequelize.literal(rangeCase)],
      raw: true,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getCategoryAverageRating = async (req, res) => {
  try {
    const result = await Product.findAll({
      attributes: [
        "category",
        [
          Product.sequelize.fn("AVG", Product.sequelize.col("rating")),
          "average_rating",
        ],
      ],
      where: {
        category: { [Op.ne]: null },
        rating: { [Op.ne]: null },
      },
      group: ["category"],
      order: [[Product.sequelize.literal('"average_rating"'), "DESC"]],
      raw: true,
    });

    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};
