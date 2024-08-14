const QR = require("./models/qr.model");
const { config } = require("dotenv");
config({ path: "./.env" });
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to DB", mongoose.connection.db.databaseName);
  } catch (err) {
    console.log("Error connecting to DB", err);
  }
};

const updateDB = async () => {
  await connectDB();
  const result = await QR.updateMany(
    { deleted: { $exists: false } },
    { $set: { deleted: false } },
  );
  process.exit();
};

updateDB();
