const sequelize = require("../config/db"); // your db.js
const Product = require("./Product");
const Review = require("./Review");

// Add associations
Product.hasMany(Review, {
  foreignKey: "product_id",
  sourceKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Review.belongsTo(Product, {
  foreignKey: "product_id",
  targetKey: "product_id",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

// Sync database (only run once or in development)
const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connected");

    await sequelize.sync({});
    console.log("✅ Models synced");

    console.log("✅ All models loaded with associations");
  } catch (error) {
    console.error("❌ Database sync error:", error);
  }
};

// Export everything
module.exports = {
  sequelize,
  Product,
  Review,
  syncDatabase,
};
