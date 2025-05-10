import express from 'express';

// middleware
// var cors = require('cors')
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { sessionHandler } from './middlewares/session';

// routes
import oauthRoutes from './routes/oauth';
// import xrpcRoutes from './routes/xrpc';

// App
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://app.blebbit.org',"https://auth.blebbit.org", "https://api.blebbit.org"],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type,Authorization,Cookie,ATProto-Proxy',
  credentials: true,
}));

app.use(sessionHandler)

app.use('/oauth', oauthRoutes);

// TODO, only enable with config
// app.use('/', xrpcRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;