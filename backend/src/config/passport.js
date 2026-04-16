const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const db = require("./db");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        const name = profile.displayName;
        const googleId = profile.id;

        if (!email) {
          return done(
            new Error("No email associated with this Google account"),
            null,
          );
        }

        // 1. Try to find by google_id
        let result = await db.query(
          "SELECT id, name, email, role_id FROM users WHERE google_id = $1",
          [googleId],
        );

        if (result.rows.length > 0) {
          return done(null, result.rows[0]);
        }

        // 2. Try to find existing user by email — link the google_id
        result = await db.query(
          "SELECT id, name, email, role_id FROM users WHERE email = $1",
          [email],
        );

        if (result.rows.length > 0) {
          await db.query("UPDATE users SET google_id = $1 WHERE email = $2", [
            googleId,
            email,
          ]);
          return done(null, result.rows[0]);
        }

        // 3. Create brand new user (no password — Google-only account)
        const inserted = await db.query(
          "INSERT INTO users (name, email, google_id, role_id) VALUES ($1, $2, $3, 2) RETURNING id, name, email, role_id",
          [name, email, googleId],
        );
        return done(null, inserted.rows[0]);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

// Minimal serialize / deserialize (session is used only during OAuth handshake)
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const result = await db.query(
      "SELECT id, name, email, role_id FROM users WHERE id = $1",
      [id],
    );
    done(null, result.rows[0] || null);
  } catch (err) {
    done(err, null);
  }
});

module.exports = passport;
