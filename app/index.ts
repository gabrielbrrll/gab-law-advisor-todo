import express from 'express';
import userRoutes from '../routes/user.routes';
import prisma from '../database/db';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET
};

passport.use(
  new JwtStrategy(jwtOptions, async (jwtPayload, done) => {
    try {
      const user = await prisma.user.findUnique({
        where: { id: jwtPayload.id }
      });
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(passport.initialize());

// Mount the user routes
app.use('/users', userRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Graceful shutdown to ensure that Prisma client disconnects
process.on('SIGTERM', async () => {
  console.info('SIGTERM signal received.');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.info('SIGINT signal received.');
  await prisma.$disconnect();
  process.exit(0);
});
