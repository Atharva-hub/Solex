import express from "express";
import dotenv from "dotenv";
import shoeRoutes from "./routes/shoeRoutes.js";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import { fileURLToPath } from "url";


dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);






const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    // methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }));
// Allow the public to view files in the uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'upload')));
app.use(express.json());
app.use("/api/shoes" , shoeRoutes);
app.use("/api/users" , userRoutes);

const PORT = process.env.PORT || 4000;
app.get("/", (req,res) => {
    res.send("Hello from the backend");
})
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
