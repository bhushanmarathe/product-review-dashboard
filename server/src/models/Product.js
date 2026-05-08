const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Product = sequelize.define(
  "Product",
  {
    product_id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    product_name: { type: DataTypes.TEXT, allowNull: false },
    category: { type: DataTypes.TEXT },
    discounted_price: { type: DataTypes.FLOAT },
    actual_price: { type: DataTypes.FLOAT },
    discount_percentage: { type: DataTypes.FLOAT },
    rating: { type: DataTypes.FLOAT },
    rating_count: { type: DataTypes.INTEGER },
    about_product: { type: DataTypes.TEXT },
  },
  {
    timestamps: true,
    id: false,
  },
);

module.exports = Product;
