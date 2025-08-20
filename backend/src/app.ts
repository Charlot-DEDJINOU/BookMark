import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { connectDatabase } from './config/database';
import { setupSwagger } from './config/swagger';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import bookmarkRoutes from './routes/bookmark';
import statsRoutes from './routes/stats';
import { errorHandler } from './middleware/error';
import { generalLimiter, authLimiter } from './middleware/rateLimit';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);

app.use(generalLimiter);

app.use('/auth', authLimiter, authRoutes);
app.use('/me', userRoutes);
app.use('/bookmarks', bookmarkRoutes);
app.use('/stats', statsRoutes);

app.get('/', (req, res) => {
  res.json({
    message: 'Bookmarks API is running!',
    documentation: '/api-docs'
  });
});

app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;