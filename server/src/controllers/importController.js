const XLSX = require("xlsx");
const { Product, Review } = require("../models");
const fs = require("fs");

exports.importData = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = req.file.path;
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];

    let data = XLSX.utils.sheet_to_json(worksheet, {
      defval: "",
    });

    data = data.map((row) =>
      Object.keys(row).reduce((acc, key) => {
        const normalizedKey = key.trim().toLowerCase();
        acc[normalizedKey] = row[key];
        return acc;
      }, {}),
    );

    if (data.length === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ message: "File is empty" });
    }

    const expectedCols = [
      "product_id",
      "product_name",
      "category",
      "discounted_price",
      "actual_price",
      "discount_percentage",
      "rating",
      "rating_count",
      "about_product",
      "user_name",
      "review_title",
      "review_content",
    ];

    const firstRow = Object.keys(data[0]);
    console.log(firstRow);
    const missingCols = expectedCols.filter((col) => !firstRow.includes(col));

    if (missingCols.length > 0) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        message: `Missing columns: ${missingCols.join(", ")}`,
      });
    }

    const productsMap = new Map();
    const reviews = [];

    for (let i = 0; i < data.length; i++) {
      const row = data[i];

      const product_id = String(row.product_id || "").trim();
      const product_name = String(row.product_name || "").trim();

      if (!product_id || !product_name) {
        continue;
      }

      if (!productsMap.has(product_id)) {
        productsMap.set(product_id, {
          product_id,
          product_name,
          category: row.category ? String(row.category).trim() : null,
          discounted_price:
            row.discounted_price !== ""
              ? parseFloat(row.discounted_price)
              : null,
          actual_price:
            row.actual_price !== "" ? parseFloat(row.actual_price) : null,
          discount_percentage:
            row.discount_percentage !== ""
              ? parseFloat(row.discount_percentage)
              : null,
          rating: row.rating !== "" ? parseFloat(row.rating) : null,
          rating_count:
            row.rating_count !== "" ? parseInt(row.rating_count) : 0,
          about_product: row.about_product
            ? String(row.about_product).trim()
            : null,
        });
      }

      const username = row.user_name ? String(row.username).trim() : null;
      const review_title = row.review_title
        ? String(row.review_title).trim()
        : null;
      const review_content = row.review_content
        ? String(row.review_content).trim()
        : null;

      const hasReviewData = username || review_title || review_content;

      if (hasReviewData) {
        reviews.push({
          product_id,
          username,
          review_title,
          review_content,
        });
      }
    }

    const products = Array.from(productsMap.values());

    const productResults = await Product.bulkCreate(products, {
      updateOnDuplicate: [
        "product_name",
        "category",
        "discounted_price",
        "actual_price",
        "discount_percentage",
        "rating",
        "rating_count",
        "about_product",
      ],
    });

    const reviewResults = reviews.length
      ? await Review.bulkCreate(reviews)
      : [];

    fs.unlinkSync(filePath);

    return res.json({
      message: "Data imported successfully",
      products: {
        inserted: products.length,
        processed: productResults.length,
      },
      reviews: {
        inserted: reviews.length,
        processed: reviewResults.length,
      },
    });
  } catch (error) {
    console.error("Import error:", error);

    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    return res.status(500).json({
      message: "Import failed: " + error.message,
    });
  }
};
