import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { prisma } from '../lib/prisma';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env['GOOGLE_CLIENT_ID']!,
      clientSecret: process.env['GOOGLE_CLIENT_SECRET']!,
      callbackURL: '/api/auth/google/callback',
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        // Check if user already exists
        let user = await prisma.user.findUnique({
          where: { googleId: profile.id }
        });

        if (user) {
          // Update last login
          user = await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          });
          // Ensure required fields are not null
          const safeUser = {
            ...user,
            name: user.name ?? '',
            picture: user.picture ?? '',
            googleId: user.googleId ?? '',
          };
          return done(null, safeUser);
        }

        // Create new user
        const newUser = await prisma.user.create({
          data: {
            email: profile.emails?.[0]?.value || '',
            name: profile.displayName || '',
            picture: profile.photos?.[0]?.value || '',
            googleId: profile.id,
            isVerified: true, // Google users are pre-verified
            lastLogin: new Date(),
          }
        });

        // Ensure required fields are not null
        const safeNewUser = {
          ...newUser,
          name: newUser.name ?? '',
          picture: newUser.picture ?? '',
          googleId: newUser.googleId ?? '',
        };

        return done(null, safeNewUser);
      } catch (error) {
        return done(error, undefined);
      }
    }
  )
);

passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id }
    });
    if (user) {
      // Ensure required fields are not null
      const safeUser = {
        ...user,
        name: user.name ?? '',
        picture: user.picture ?? '',
        googleId: user.googleId ?? '',
        // Add other fields as needed if your User interface requires them to be non-null
      };
      done(null, safeUser);
    } else {
      done(null, null);
    }
  } catch (error) {
    done(error, null);
  }
});

export default passport;
