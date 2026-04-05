console.log("APP.JS IS RUNNING 🔥");
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import swaggerSpec from './config/swagger.ts';
import { globalLimiter } from './middlewares/rateLimiter.ts';
import authRoutes from './routes/authRoutes.ts';
import userRoutes from './routes/userRoutes.ts';
import recordRoutes from './routes/recordRoutes.ts';
import dashboardRoutes from './routes/dashboardRoutes.ts';
import { notFound, errorHandler } from './middlewares/errorMiddleware.ts';

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

app.use(globalLimiter);

// Swagger API docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


app.get('/health', (req, res) => {
  res.json({ ok: true, service: 'zorvyn-backend' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/records', recordRoutes);
app.use('/api/dashboard', dashboardRoutes);



app.use(notFound);
app.use(errorHandler);

export default app;

