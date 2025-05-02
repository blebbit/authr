import express from 'express';

// middleware
var cors = require('cors')
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler';
import { sessionHandler } from './middlewares/session';

// routes
import oauthRoutes from './routes/oauth';
import xrpcRoutes from './routes/xrpc';

// App
const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['https://app.blebbit.org',"https://auth.blebbit.org"], // Allow all origins
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Allow all HTTP methods
  allowedHeaders: '*', // Allow all headers
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
}));

// Unauth'd Routes
// app.options('*', cors())
app.use('/oauth', oauthRoutes);

app.use(sessionHandler)

// TODO, only enable with config
app.use('/', xrpcRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;