const { Product, Review } = require("../models");
const { Op } = require("sequelize");

exports.getProducts = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      rating = "",
      page = 1,
      limit = 10,
    } = req.query;

    const pageNumber = Number(page);
    const pageLimit = Number(limit);

    if (!Number.isInteger(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ message: "Invalid page value" });
    }

    if (!Number.isInteger(pageLimit) || pageLimit < 1 || pageLimit > 100) {
      return res.status(400).json({ message: "Invalid limit value" });
    }

    const where = {};

    if (search.trim()) {
      where.product_name = {
        [Op.iLike]: `%${search.trim()}%`,
      };
    }

    if (category.trim()) {
      where.category = {
        [Op.iLike]: `%${category.trim()}%`,
      };
    }

    if (rating.trim()) {
      const [min, max] = rating.split("-").map(Number);

      if (Number.isNaN(min) || Number.isNaN(max)) {
        return res.status(400).json({ message: "Invalid rating filter" });
      }

      where.rating = {
        [Op.between]: [min, max],
      };
    }

    const offset = (pageNumber - 1) * pageLimit;

    const { count, rows } = await Product.findAndCountAll({
      where,
      include: [
        {
          model: Review,
          attributes: ["username", "review_title", "review_content"],
        },
      ],
      distinct: true,
      limit: pageLimit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      total: count,
      page: pageNumber,
      limit: pageLimit,
      totalPages: Math.ceil(count / pageLimit),
      data: rows,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    return res.status(500).json({
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};
