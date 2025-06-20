const { Sequelize } = require("sequelize");
 require("dotenv").config();

// Create Sequelize instance with PostgreSQL connection
const sequelize = new Sequelize({
  dialect: "postgres",
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,

 logging: process.env.NODE_ENV === 'development' ? console.log : false,
   // Automatically adds created_at, updated_at, and deleted_at columns to all models
  define: {
    timestamps: true,
    underscored: true,
    paranoid: true,
  },
});

// Test database connection

async function testConnection() {
  try {
    await sequelize.authenticate();  // returns a Promise that: resolves if successfulor rejects if fails with an error

    console.log(" Database connection successfully");
  } catch (error) {
    console.error(" Failed to connected", error.message);
    process.exit(1); // Exit application on connection failure
  }
}

testConnection();

module.exports = sequelize;
