import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE || 'mindcare_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
