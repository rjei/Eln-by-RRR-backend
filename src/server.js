import app from "./app.js";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;

// Test database connection
sequelize.authenticate()
  .then(() => {
    console.log("✅ Database connected successfully");

    // Sync models (set force: true only in development to reset tables)
    // In production, use migrations instead
    if (process.env.NODE_ENV === 'development') {
      sequelize.sync({ alter: true })
        .then(() => console.log("✅ Models synchronized"))
        .catch(err => console.error("❌ Model sync error:", err));
    }
  })
  .catch(err => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

