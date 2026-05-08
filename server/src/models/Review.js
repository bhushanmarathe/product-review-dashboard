const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Review = sequelize.define("Review", {
  product_id: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.TEXT },
  review_title: { type: DataTypes.TEXT },
  review_content: { type: DataTypes.TEXT },
});

module.exports = Review;
