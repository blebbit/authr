import app from './app';
import config from './config';
import { migrateToLatest } from './db/migrator'
import { initBoss } from './jobs/pgboss';

migrateToLatest()
  .then(async ()=>{
    // start pgboss process (and probably migrations?)
    await initBoss()
    console.log('pgboss started')
  })
  .then(()=>{
    app.listen(config.port, () => {
      console.log(`Server running on port ${config.port}`);
    });
  })