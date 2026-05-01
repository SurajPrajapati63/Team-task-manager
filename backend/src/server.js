const app = require("./app");
const { testConnection } = require("./config/db");

const PORT = process.env.PORT || 5000;

testConnection()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to database:", error.message);
    process.exit(1);
  });
