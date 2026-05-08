require("dotenv").config();
const app = require("./app");
const { syncDatabase } = require("./models");

const PORT = process.env.PORT || 5000;

syncDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to start server:", error);
    process.exit(1);
  });
