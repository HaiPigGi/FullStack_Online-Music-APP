import express from 'express';
import bodyParser from 'body-parser';
import db from './src/config/database.js';
import Song from './src/model/song.js';
import dotenv from "dotenv";
import router from './src/routes/index.js';
import cors from "cors";
import verifyToken from './src/middleware/middle.js';
dotenv.config();

const app = express();

try {
    await db.authenticate();
    console.log("Database Connected");
    Song.sync();
} catch (err) {
    console.log(err);
}

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));
// Menggunakan cors middleware
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

// Gunakan middleware verifyToken sebelum router

// Gunakan router
app.use(router);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
