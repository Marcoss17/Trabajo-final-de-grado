const jwt = require("jsonwebtoken");

const verificarToken = (req, res, next) => {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ mensaje: "Acceso denegado. Token no proporcionado." });
  }

  // Formato: "Bearer <token>"
  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ mensaje: "Token malformado o no proporcionado." });
  }

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = verificado; // Info usuario agregada a request
    next();
  } catch (error) {
    res.status(400).json({ mensaje: "Token inválido." });
  }
};

module.exports = verificarToken;
