import express, { urlencoded } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../db.js';


const jwtsecret =  process.env.jwtsecret;


const app = express();
app.use(express.urlencoded('extended', true));
const router = express.Router();



let token = '';

router.post("/signup", async (req, res) => {
  const { username, collegeName, currentYear, email, password } = req.body;

  // ✅ Basic backend validation
  if (!username || !email || !password) {
    return res.status(400).json({ error: "All required fields must be filled" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const sql = `
      INSERT INTO users
      (username, college, currentyear, email, password_token)
      VALUES (?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [username, collegeName, currentYear, email, hashedPassword],
      (err, result) => {
        if (err) {
          // ✅ Handle duplicate email / username properly
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ error: "User already exists" });
          }

          return res.status(500).json({ error: "Database error" });
        }

        return res.status(201).json({ message: "Signup successful" });
      }
    );
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
});

// -----------------------------------------------------------------------------------------
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (result.length === 0) {
      return res.status(401).json({ error: "Email is not registered" });
    }

    const user = result[0];

    const passcheck = await bcrypt.compare(password, user.password_token);

    if (!passcheck) {
      return res.status(401).json({ error: "Wrong password" });
    }

    // ✅ JWT with user ID only
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // ✅ HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000
    });

    // ✅ Send ONLY safe user data
    return res.json({
      message: "logged in",
      userdata: {
        id: user.id,
        username: user.username,
        college: user.college,
        currentYear: user.currentyear,
        email: user.email
      }
    });
  });
});


// -----------------------------------------------------------------------------------------


router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: false // true in production
  });

  res.json({ message: "Logged out successfully" });
});

//-----------------------------------------------------------------------------------------------



export default router;