import passport from "passport"
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import { VerifyCallback } from "passport-oauth2";



passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID || " ",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || " ",
            callbackURL: 'http://localhost:5000/auth/github/callback',
            scope:[ 'user:email' ]
        },
        function(accessToken :string, refreshToken:string, profile:Profile, done:VerifyCallback) {
            done(null, profile);
        }
    )
);


passport.serializeUser((user, done) => {
    done(null, user);
  });
  
  passport.deserializeUser((user: Express.User, done) => {
    done(null, user);
  });
  
  export default passport




