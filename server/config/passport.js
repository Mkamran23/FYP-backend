const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const GitHubStrategy = require("passport-github2").Strategy;

const configurePassport = () => {
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL:
            process.env.GOOGLE_CALLBACK_URL ||
            "http://localhost:5000/api/auth/google/callback",
        },
        (_accessToken, _refreshToken, profile, done) => done(null, profile),
      ),
    );
  }

  if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
    passport.use(
      new GitHubStrategy(
        {
          clientID: process.env.GITHUB_CLIENT_ID,
          clientSecret: process.env.GITHUB_CLIENT_SECRET,
          callbackURL:
            process.env.GITHUB_CALLBACK_URL ||
            "http://localhost:5000/api/auth/github/callback",
        },
        async (accessToken, _refreshToken, profile, done) => {
          try {
            if (!profile.emails?.length) {
              const response = await fetch(
                "https://api.github.com/user/emails",
                {
                  headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Accept: "application/vnd.github+json",
                    "User-Agent": "SkillSwap",
                  },
                },
              );
              if (!response.ok)
                throw new Error("Unable to retrieve your GitHub email address");
              const emails = await response.json();
              const email =
                emails.find((item) => item.primary && item.verified) ||
                emails.find((item) => item.verified);
              if (email?.email) profile.emails = [{ value: email.email }];
            }
            return done(null, profile);
          } catch (error) {
            return done(error);
          }
        },
      ),
    );
  }
};

module.exports = { passport, configurePassport };
