const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require('path');
const connectDB = require("./config/db");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/usuario");
const userRutinasRoutes = require("./routes/userRutinas");
const progresoRoutes = require("./routes/progreso");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Servir carpeta uploads como estática para acceder a las fotos de perfil
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.get("/", (req, res) => {
  res.send("API funcionando");
});

app.use("/api/auth", authRoutes);
app.use("/api/usuario", userRoutes);
app.use("/api/usuario/rutinas", userRutinasRoutes); // ya está bien
app.use("/api/progreso", progresoRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor en puerto ${PORT}`);
});
