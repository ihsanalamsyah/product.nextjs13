
import jwt  from 'jsonwebtoken';
import env from 'dotenv';
env.config();

const JWT_SECRET = process.env.JWT_SECRET!;
const generateToken = (data) => {
    
    return new Promise((resolve, reject) => {
        jwt.sign(data, JWT_SECRET, (err, token) => {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
};

export default generateToken;