import mysql from 'mysql2';

const db = mysql.createConnection({
    host:'127.0.0.1',
    user: 'root',
    password:'Purushottam@786',
    database : 'campusshare'
});

db.connect((err)=>{
    if(err){
        console.error('DB error : ',err);
    }else{
        //  console.log("MySQL Connected");
    }
});

export default db;