import jwt from "jsonwebtoken";
import env from 'dotenv';
import { authPlugins } from "mysql2";

env.config();
const JWT_SECRET = process.env.JWT_SECRET;

 export function auth(req, res, next) {
    const authHeader = req.headers.authorization;
    
    if(authHeader){
        //jika ada header auth yang dikirimkan
        const token = authHeader.split(' ')[1];

        jwt.verify(token, JWT_SECRET, function(err, user){
            if(err){
                return res.status(403).json({msg: "Invalid token !!!!"})
            }
            req.user = user;
            return next();
        })
    }
    else{
        return res.status(401).json({msg: "Invalid or Expired token !!!"});
    }
}
