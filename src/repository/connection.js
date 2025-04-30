import mysql from 'mysql2/promise';

const con = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PWD,
    database: process.env.MYSQL_DB,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    typeCast: function (field, next) {
        if (field.type === 'TINY' && field.length === 1) {
            return (field.string() === '1');
        } else if (field.type.includes('DECIMAL')) {
            return Number(field.string());
        } else {
            return next();
        }
    }
});

console.log("Pool de conexões com o DB criado");

export default con;
