import express from 'express';
import cors from 'cors';
import path from 'path';
import dotenv from 'dotenv';
import { comparisonRoutes } from './routes/comparison';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/temp', express.static(path.join(__dirname, '../temp')));

// Routes
app.use('/api/comparison', comparisonRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Pixel Perfection Server is running' });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', error);
  res.status(500).json({ 
    error: 'Internal server error',
    message: error.message 
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Pixel Perfection Server running on port ${PORT}`);
});

export default app;