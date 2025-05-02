import app from './app';
import config from './config';
import { migrateToLatest } from './db/migrator'

migrateToLatest().then(()=>{
  app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
  });
})