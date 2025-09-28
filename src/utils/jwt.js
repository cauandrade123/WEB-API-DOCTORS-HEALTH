import 'dotenv/config'
import jwt from  'jsonwebtoken'

export default function authenticateToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    console.log("Token recebido:", token); 
    if (!token) {
        return res.sendStatus(401); 
    }

    jwt.verify(token, process.env.JWT_SECRET2, (err, user) => {
        if (err) {
            console.error("Token inválido:", err);
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
    
}

