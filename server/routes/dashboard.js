import express from 'express' ;
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db.js';
import cookieParser from "cookie-parser";
import multer from  'multer';
import fs from 'fs';
import path from 'path';
const app = express();
app.use(cookieParser());


const jwtsecret = "campusshare@123";
const router = express.Router();


//----------------------------multer middleware for file upload --------------------------

const storage = multer.diskStorage({
  destination: (req, file, cb) => {

    if (req.originalUrl.includes("/profile/img")) {
      cb(null, "uploads/profiles");
    } 
    else if (req.originalUrl.includes("/post")) {
      cb(null, "uploads/posts");
    } 
    else {
      cb(null, "uploads"); // fallback
    }

  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "_" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);

    cb(null, uniqueName);
  },
});

const upload = multer({ storage });


//------------------------ JWT authmiddleware ------------------------


const authmiddleware = (req, res, next) => {
  const token = req.cookies.token;
  // console.log("----------------------");
  if (!token) {
    // console.log(token);

    return res.status(401).json({ error: "Unauthsadfasdzed" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

router.use(authmiddleware);

//-----------------------dashboard route ---------------------------------


router.get("/dashboard", authmiddleware, (req, res) => {
  // ✅ req.userId already set by middleware
  db.query(
    "SELECT id, username, college, currentyear,profileimglink FROM users WHERE id = ?",
    [req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: result[0]
      });
    }
  );
});

//----------------------------dashboard profile--------------------------------------------

router.get('/dashboard/profile',(req,res)=>{
   db.query(
    "SELECT id, username, college, email, currentyear ,profileimglink FROM users WHERE id = ?",
    [req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: result[0]
      });
    }
  );

});

//------------------------------------------------------------------------

router.put("/dashboard/edit", authmiddleware, (req, res) => {
  const { username, collegeName, currentYear, email } = req.body;

  if (!username || !email) {
    return res.status(400).json({ error: "Required fields missing" });
  }

  db.query(
    "UPDATE users SET username=?, college=?, currentyear=?, email=? WHERE id=?",
    [username, collegeName, currentYear, email, req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({ message: "Profile updated successfully" });
    }
  );
});

//---------------------dashboard profile post -------------------------------------

router.post('/dashboard/profile/post',authmiddleware,upload.single("image"),  (req,res)=>{
    const {post_title,post_price,post_description,post_category} = req.body;
   const imagepath = req.file ? `/uploads/posts/${req.file.filename}`: null; 
    // console.log(req.body);
    // console.log(req.file.filename);
    if(!post_title || !post_description || !post_category || !post_price){
      return res.status(400).json({error:"Required fields missing"});
    };
    
    db.query(
      "INSERT INTO userposts (user_id,imglink,post_title,post_price,post_description , post_category) VALUES(?,?,?,?,?,?)",
      [req.userId,imagepath,post_title,post_price,post_description,post_category],
      (err)=>{
        if(err) return res.status(550).json({error:"DB error"});
         res.json({message:"Post created successfully"});
      }
    );

});
//------------------------------delete profile posts--------------------------------

router.put('/dashboard/profile/img',authmiddleware, upload.single("profileImage"),(req, res) => {

    if (!req.file) {
      return res.status(400).json({ error: "No image uploaded" });
    }

    const profileimglink = `/uploads/profiles/${req.file.filename}`;

    db.query(
      'UPDATE users SET profileimglink = ? WHERE id = ?',
      [profileimglink, req.userId],
      (err) => {
        if (err) {
          return res.status(500).json({ error: "DB error" });
        }

        res.json({ message: "Profile image updated", profileimglink });
      }
    );
  }
);


//------------------------------profile posts--------------------------------

router.get('/dashboard/profile/userposts',(req,res)=>{
   db.query(
    "SELECT id,imglink, post_title, post_price,post_description, post_category FROM userposts WHERE user_id = ?",
    [req.userId],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (result.length == 0) {
        return res.status(200).json({ error: "User has no posts" });
      }

      res.json({
        user: result
      });
    }
  );

});

//------------------------------delete profile posts--------------------------------


router.delete(
  "/dashboard/profile/userposts/:postId",
  authmiddleware,
  (req, res) => {

    const postId = req.params.postId;

    if (!postId) {
      return res.status(400).json({ error: "Post ID missing" });
    }

    // 1️⃣ Get image path first
    db.query(
      "SELECT imglink FROM userposts WHERE id = ? AND user_id = ?",
      [postId, req.userId],
      (err, result) => {

        if (err) {
          return res.status(500).json({ error: "DB error" });
        }

        if (result.length === 0) {
          return res.status(404).json({ error: "Post not found" });
        }

        const imagePath = result[0].imglink;

        // 2️⃣ Delete image from disk
        if (imagePath) {

          const fullPath = path.join(process.cwd(), imagePath);

          fs.unlink(fullPath, (err) => {
            if (err) {
              // console.log("Image already deleted or not found");
            }
          });
        }

        // 3️⃣ Now delete DB record
        db.query(
          "DELETE FROM userposts WHERE id = ? AND user_id = ?",
          [postId, req.userId],
          (err, result) => {

            if (err) {
              return res.status(500).json({ error: "Delete failed" });
            }

            res.json({ message: "Post deleted successfully" });
          }
        );
      }
    );
  }
);


//------------------------ show all posts -------------------------------------------
router.post('/dashboard/all/userposts', authmiddleware, (req, res) => {

  const { college, category ,location} = req.body;

  let sql = "SELECT * FROM allposts WHERE 1=1";
  let values = [];

  if (college) {
    sql += " AND college = ?";
    values.push(college);
  }

  if (category) {
    sql += " AND post_category = ?";
    values.push(category);
  }
if (location) {
  sql += " AND college LIKE ?";
  values.push(`%${location}%`);
}

  db.query(sql, values, (err, result) => {
    if (err) {
      // console.log(err);
      return res.status(500).json({ error: "DB error" });
    }
    // console.log(result);
    res.json({ user: result });
  });

});

//---------------------------random user ------------------------------------

router.get('/dashboard/profile/:id',(req,res)=>{

  // console.log(req.params.id);
   db.query(
    "SELECT id, username, college, email, currentyear ,profileimglink FROM users WHERE id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: result[0]
      });
    }
  );

});

//------------------------------------------------------------------------------------------------
router.get('/dashboard/profile/userposts/:id',(req,res)=>{

  // console.log(req.params.id);
   db.query(
    "SELECT id,imglink, post_title, post_price,post_description, post_category FROM userposts WHERE user_id = ?",
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({ error: "DB error" });
      }

      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }

      res.json({
        user: result
      });
    }
  );

});


//-------------------------------------MESSAGE ROUTEING------------------------------------------------------

// routes/dashboard.js — messages route 
// almost clerar ahe
router.get('/api/messages/:otherId', async (req, res) => {
  const myId    = req.userId;
  const otherId = req.params.otherId;

  // console.log('myId:', myId, 'otherId:', otherId); // debug

  try {
    const [messages] = await db.promise().execute(
      `SELECT * FROM messages
       WHERE (sender_id = ? AND receiver_id = ?)
          OR (sender_id = ? AND receiver_id = ?)
       ORDER BY timestamp ASC`,
      [myId, otherId, otherId, myId]
    );

    // console.log('messages:', messages); // debug
    res.json(messages);

  } catch (err) {
    // console.error('messages error:', err);
    res.status(500).json({ error: err.message });
  }
});


router.get('/api/chatlist', async (req, res) => {
  const myId = req.userId;
  console.log('myId:', myId);

  try {
    // ✅ use db.promise() — works with your existing db.js
    const [contactRows] = await db.promise().execute(
      `SELECT DISTINCT
         CASE WHEN sender_id = ? THEN receiver_id
              ELSE sender_id
         END AS contact_id
       FROM messages
       WHERE sender_id = ? OR receiver_id = ?`,
      [myId, myId, myId]
    );

    // console.log('contactRows:', contactRows);

    if (!contactRows || contactRows.length === 0) {
      return res.json([]);
    }

    // Step 2 — get user details
    const contactIds   = contactRows.map(r => r.contact_id);
    const placeholders = contactIds.map(() => '?').join(',');

    const [users] = await db.promise().execute(
      `SELECT id, username, profileimglink AS avatar
       FROM users WHERE id IN (${placeholders})`,
      contactIds
    );

    // console.log('users:', users);

    // Step 3 — last message + unread per user
    const result = await Promise.all(users.map(async (user) => {

      const [lastMsgRows] = await db.promise().execute(
        `SELECT message, timestamp FROM messages
         WHERE (sender_id = ? AND receiver_id = ?)
            OR (sender_id = ? AND receiver_id = ?)
         ORDER BY timestamp DESC
         LIMIT 1`,
        [myId, user.id, user.id, myId]
      );

      const [unreadRows] = await db.promise().execute(
        `SELECT COUNT(*) AS count FROM messages
         WHERE sender_id = ? AND receiver_id = ? AND is_read = 0`,
        [user.id, myId]
      );

      return {
        id:                user.id,
        username:          user.username,
        avatar:            user.avatar,
        last_message:      lastMsgRows[0]?.message   || '',
        last_message_time: lastMsgRows[0]?.timestamp || null,
        unread_count:      unreadRows[0]?.count       || 0
      };
    }));

    result.sort((a, b) =>
      new Date(b.last_message_time) - new Date(a.last_message_time)
    );

    // console.log('final result:', result);
    res.json(result);

  } catch (err) {
    // console.error('chatlist error:', err);
    res.status(500).json({ error: err.message });
  }
});

//----------delte chat but deleting for both the users
// router.delete("/chat/:id", async (req, res) => {
//   console.log('hitting')
//     try {
//         const { id } = req.params;

//         const sql = "DELETE FROM chats WHERE id = ?";

//         db.query(sql, [id], (err, result) => {
//             if (err) {
//                 return res.status(500).json({
//                     success: false,
//                     message: err.message,
//                 });
//             }

//             res.json({
//                 success: true,
//                 message: "Chat deleted successfully",
//             });
//         });

//     } catch (err) {
//         res.status(500).json({
//             success: false,
//             message: err.message,
//         });
//     }
// });

export default router;