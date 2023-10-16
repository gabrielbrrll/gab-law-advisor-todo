import express from 'express';
import userRoutes from '../routes/user.routes';
import prisma from '../database/db';

const app = express();
const PORT = 3000;

app.use(express.json());

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
