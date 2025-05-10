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
  origin: process.env.NODE_ENVRIONMENT === "development" ?
    ['https://app.blebbit.org',"https://auth.blebbit.org", "https://api.blebbit.org"]
    :
    ['https://app.authr.blebbit.dev',"https://authr.blebbit.dev", "https://api.authr.blebbit.dev"]
  ,
  // origin: function (origin, callback) {
  //   // db.loadOrigins is an example call to load
  //   // a list of origins from a backing database
  //   db.loadOrigins(function (error, origins) {
  //     callback(error, origins)
  //   })
  // },
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