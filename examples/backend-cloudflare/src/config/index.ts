// import dotenv from 'dotenv';

// dotenv.config();

const stringToBoolean = (stringValue: string) => {
    switch(stringValue?.toLowerCase()?.trim()){
        case "true": 
        case "yes": 
        case "1": 
          return true;

        case "false": 
        case "no": 
        case "0": 
        case null: 
        case undefined:
          return false;

        default: 
          return JSON.parse(stringValue);
    }
}

interface Config {
  port: number;
  nodeEnv: string;

  cookie: {
    name: string;
  }

  db: {
    host: string;
    port: number;
    user: string;
    password: string;
    database: string;
    ssl: boolean;
    maxConnections: number;
  }

  webhook: {
    secret: string;
  }
}

let config: Config = undefined as any;

export function getConfig(env: any): Config {

  if (config) {
    return config;
  }

  config = {
    port: Number(env.PORT) || 3001,
    nodeEnv: env.NODE_ENV || 'development',

    cookie: {
      name: env.COOKIE_NAME || 'authr_session',
    },

    db: {
      host: env.DB_HOST || 'localhost',
      port: Number(env.DB_PORT) || 3002,
      user: env.DB_USER || 'example',
      password: env.DB_PASSWORD || 'example',
      database: env.DB_NAME || 'example',
      ssl: stringToBoolean(env.DB_SSL || "false"),
      maxConnections: Number(env.DB_MAX_CONNECTIONS) || 10,
    },

    webhook: {
      secret: process.env.WEBHOOK_SECRET || 'authr-webhook-secret',
    },
  }


  // if (config.nodeEnv === 'development') {
  //   console.log("env:", env)
  //   console.log("config:", config)
  // }

  return config;
}