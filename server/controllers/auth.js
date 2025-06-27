import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"

export const login = (req, res) => {
  const sql = "SELECT * FROM utilisateurs WHERE username = ?";
  db.query(sql, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length === 0) return res.status(404).json("Aucun utilisateur correspondant !");

    const checkPassword = bcrypt.compareSync(req.body.password, data[0].password);
    if (!checkPassword) return res.status(400).json("Mot de passe ou nom d'utilisateur incorrect !");

    const token = jwt.sign({ id: data[0].id }, "secretKey");
    const { password, ...others } = data[0];

    res.cookie("accessToken", token, {
      httpOnly: true,
     
    }).status(200)
    .json(others);
  });
};export const register = (req, res) => {
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(req.body.password, salt);

  const sqlCheck = "SELECT * FROM utilisateurs WHERE username = ?";
  db.query(sqlCheck, [req.body.username], (err, data) => {
    if (err) return res.status(500).json(err);
    if (data.length) return res.status(409).json("L'utilisateur existe déjà !");

    const insertSql = "INSERT INTO utilisateurs (username, email, password, name) VALUES (?)";
    const values = [req.body.username, req.body.email, hashedPassword, req.body.name];

    db.query(insertSql, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Utilisateur a été créé !");
    });
  });
};
export const logout = (req, res) => {
  res.clearCookie("accessToken", {
    secure: true,
    sameSite: "none"
  });
  return res.status(200).json("Déconnexion réussie");
};

