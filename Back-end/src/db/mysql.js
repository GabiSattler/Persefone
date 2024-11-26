import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  database:  'persefone',
  password: 'gabi1112'
});

export default pool;