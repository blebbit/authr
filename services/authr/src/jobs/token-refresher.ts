import PgBoss from 'pg-boss';

import config from '@/config';
import { db } from '../db/client';
import { getClient } from "@/lib/auth/oauth/client";

let boss: PgBoss = null as any;

export const AtprotoOauthRefreshQueue = 'atproto-oauth-refresh';
export const AtprotoOauthRefreshCron =  'atproto-oauth-refresh-cron';

export async function tokenRefresher() {
  if (!boss) {
    boss = new PgBoss({
      host: config.pgboss.host,
      port: config.pgboss.port,
      user: config.pgboss.user,
      password: config.pgboss.password,
      database: config.pgboss.database,
      ssl: config.pgboss.ssl,
      max: config.pgboss.maxConnections,
    });

    boss.on('error', console.error)

    // start pgboss process (and probably migrations?)
    await boss.start()

    // create refresh work queue and handler
    await boss.createQueue(AtprotoOauthRefreshQueue)
    await boss.work(AtprotoOauthRefreshQueue, { pollingIntervalSeconds: 10, batchSize: 100 }, async (jobs) => {
      console.log('AtprotoOauthRefreshQueue jobs:', jobs)

      const client = await getClient()
      for (const job of jobs) {
        await client.restore(job.data.did, true)
      }
    })

    // create cronjob to look for aging tokens and submit them to the refresh queue
    await boss.createQueue(AtprotoOauthRefreshCron)
    await boss.schedule(AtprotoOauthRefreshCron, '*/2 * * * *', {
      // jobId: 'atproto-oauth-refresh-cron',
      // other job data
    },{
      // attempts: 1,
      // removeOnComplete: true,
      // removeOnFail: false,
    })
    await boss.work(AtprotoOauthRefreshCron, { pollingIntervalSeconds: 10 }, async (job) => {
      console.log('CRON', job.map((j) => j.id))
      // lookup aging tokens

      const sessions = await db
        .selectFrom("oauth_session")
        .select(["key", "refresh_expires_at"])
        .where("refresh_expires_at", "<", new Date(Date.now() + 1000 * 60 * 10)) // expires in less than 10 minutes
        .execute()

      // console.log('AtprotoOauthRefreshCron sessions:', sessions)
      // submit them to the refresh queue

      const jobs = sessions.map((session) => ({
        name: AtprotoOauthRefreshQueue,
        data: {
          // job data
          did: session.key,
        }
      }))
      // console.log('AtprotoOauthRefreshCron jobs:', jobs)

      boss.insert(jobs)
    })

  }

  return boss
}