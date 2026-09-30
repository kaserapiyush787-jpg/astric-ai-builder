const express = require("express");
const cors = require("cors");
//const SUPABASE = require("SUPABASE");
require("dotenv").config();
console.log(process.env.SUPABASE_URI);

const aiRoutes = require("./ai");
const authRoutes = require("./routes/auth");
const generateRoutes = require("./routes/generate");
const projectRoutes = require("./routes/project");
const publishRoutes = require("./routes/publish");
const dashboardRoutes = require("./routes/dashboard");
const app = express();

app.use("/api/publish", publishRoutes);
app.use("/api/dashboard", dashboardRoutes);


 

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", aiRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/generate", generateRoutes);
app.use("/api/projects", projectRoutes);

app.get("/", (req, res) => {
  res.send("🚀 ASTRIC AI Builder Backend Running Successfully");
});

// Server Start
const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});