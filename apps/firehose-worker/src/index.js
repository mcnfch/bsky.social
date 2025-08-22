// Firehose -> Postgres ingestor (minimal)
// Requires Postgres env: PGHOST, PGPORT=5434, PGUSER, PGPASSWORD, PGDATABASE

import { Firehose } from '@atproto/sync'
import { IdResolver } from '@atproto/identity'
import pg from 'pg'

const { Client } = pg

async function ensureTables(client) {
  await client.query(`
    create table if not exists firehose_cursors (
      id int primary key default 1,
      cursor bigint
    );
    insert into firehose_cursors (id) values (1)
    on conflict (id) do nothing;
    create table if not exists post_counts (
      day date primary key,
      count bigint not null default 0
    );
  `)
}

async function getCursor(client) {
  const res = await client.query('select cursor from firehose_cursors where id=1')
  return res.rows[0]?.cursor || undefined
}

async function setCursor(client, cursor) {
  await client.query('update firehose_cursors set cursor=$1 where id=1', [
    cursor,
  ])
}

async function main() {
  const pgClient = new Client()
  await pgClient.connect()
  await ensureTables(pgClient)

  const idResolver = new IdResolver()
  const firehose = new Firehose({
    idResolver,
    getCursor: () => getCursor(pgClient),
    handleEvent: async (evt) => {
      if (evt.event === 'create' && evt.collection === 'app.bsky.feed.post') {
        const day = new Date(evt.time).toISOString().slice(0, 10)
        await pgClient.query(
          'insert into post_counts(day, count) values ($1,1) on conflict(day) do update set count=post_counts.count+1',
          [day],
        )
      }
      if (evt.cursor) {
        await setCursor(pgClient, evt.cursor)
      }
    },
    onError: (err) => {
      // eslint-disable-next-line no-console
      console.error('firehose error', err)
    },
  })
  await firehose.start()
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err)
  process.exit(1)
})
