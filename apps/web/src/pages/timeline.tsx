import Head from 'next/head'
import React, { useEffect, useState } from 'react'
import { BskyAgent } from '@atproto/api'

type FeedItem = {
  uri: string
  cid: string
  author?: { handle?: string; displayName?: string }
  record?: { text?: string; createdAt?: string }
}

export default function Timeline() {
  const [appview, setAppview] = useState<string>('')
  const [pds, setPds] = useState<string>('')
  const [appClient, setAppClient] = useState<BskyAgent | null>(null)
  const [feed, setFeed] = useState<FeedItem[]>([])
  const [text, setText] = useState('Hello from the demo!')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const app = sessionStorage.getItem('atp.appview') ||
      process.env.NEXT_PUBLIC_ATP_APPVIEW || 'https://api.bsky.app'
    const p = sessionStorage.getItem('atp.pds') ||
      process.env.NEXT_PUBLIC_ATP_PDS || 'https://bsky.social'
    setAppview(app)
    setPds(p)
    const cli = new BskyAgent({ service: app })
    setAppClient(cli)
    ;(async () => {
      try {
        const res = await cli.getTimeline({ limit: 25 })
        setFeed(res.data.feed as any)
      } catch (err: any) {
        setError(err?.message || 'Failed to load timeline')
      }
    })()
  }, [])

  const onPost = async () => {
    const did = sessionStorage.getItem('atp.did')
    const accessJwt = sessionStorage.getItem('atp.accessJwt')
    const refreshJwt = sessionStorage.getItem('atp.refreshJwt')
    const loginService = sessionStorage.getItem('atp.loginService') || pds
    if (!did || !accessJwt || !loginService || !appClient) {
      setError('Missing session; please log in again')
      return
    }
    setError(null)
    try {
      // Use the public login service (e.g., https://bsky.social) to avoid CORS
      const writer = new BskyAgent({ service: loginService })
      await writer.resumeSession({ did, accessJwt, refreshJwt, handle: '' as any, active: true })
      // Force dispatch to the public origin instead of internal PDS URL
      try { (writer as any).sessionManager.pdsUrl = new URL(loginService) } catch {}
      await writer.post({ text })
      const res = await appClient.getTimeline({ limit: 25 })
      setFeed(res.data.feed as any)
      setText('')
    } catch (err: any) {
      setError(err?.message || 'Failed to post')
    }
  }

  return (
    <>
      <Head>
        <title>Timeline — ATProto Demo</title>
      </Head>
      <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>Timeline</h1>
        <p>AppView: {appview} · PDS: {pds}</p>
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's happening?"
            style={{ flex: 1 }}
          />
          <button onClick={onPost}>Post</button>
        </div>
        {error && <p style={{ color: 'crimson' }}>{error}</p>}
        <ul style={{ listStyle: 'none', padding: 0, display: 'grid', gap: 12 }}>
          {feed.map((it) => (
            <li key={it.uri} style={{ border: '1px solid #ddd', borderRadius: 8, padding: 12 }}>
              <div style={{ fontWeight: 600 }}>
                {it.author?.displayName || it.author?.handle}
              </div>
              <div>{it.record?.text}</div>
              <div style={{ color: '#666', fontSize: 12 }}>{it.uri}</div>
            </li>
          ))}
        </ul>
      </main>
    </>
  )
}
