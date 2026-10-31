
require("dotenv").config();

const bcrypt = require("bcrypt");
const pool = require("../config/db");

async function createAdmin() {
  try {
    const name = process.env.ADMIN_NAME;
    const email = process.env.ADMIN_EMAIL;
    const password = process.env.ADMIN_PASSWORD;

    if (!name || !email || !password) {
      throw new Error("Admin environment variables are missing");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    await pool.query(
      `INSERT INTO public.admins (name, email, password_hash)
       VALUES ($1, $2, $3)
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         password_hash = EXCLUDED.password_hash`,
      [name, email.toLowerCase(), passwordHash]
    );

    console.log("Admin account created successfully!");
  } catch (error) {
    console.error("Admin creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

createAdmin();
