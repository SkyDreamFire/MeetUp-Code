    import {db} from "../connect.js"
import jwt from "jsonwebtoken"
export const getUser = (req,res)=>{

const userId  = req.params.userId;
const sql = "select * from utilisateurs where id=?"
db.query(sql,[userId], (err, data) => {
      if (err) return res.status(500).json(err);
      const {password, ...info} = data[0];
      return res.json(info);
    });
} 
export const UpdateUser = (req,res)=>{

 const token = req.cookies.accessToken;
    if(!token)  res.status(401).json("Non connecté !")

        jwt.verify(token,"secretKey", (err, userInfo)=>{
            if(err) return res.status(403).json("Token non valide")
  
                const sql = "update utilisateurs set name= ?, city = ?, website = ?, profilpic=?, coverpic=? where id = ?"

                db.query(sql,[
    req.body.name,
    req.body.city,
    req.body.website,
    req.body.coverpic,
    req.body.profilpic,
    userInfo.id,
], (err, data) => {
      if (err) return res.status(500).json(err);
     if(data.affectedRows > 0) return res.json("mise à jour !");
     return res.status(403).json("Tu peux seulement mettre à jour ta publication!")
    });
        });
} ;