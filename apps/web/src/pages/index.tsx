import Head from 'next/head';
import React from 'react';

export default function Home() {
  return (
    <>
      <Head>
        <title>ATProto Demo</title>
      </Head>
      <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
        <h1>AT Protocol Demo</h1>
        <p>Server: http://localhost:7777</p>
        <ul>
          <li><a href="/login">Login (app password)</a></li>
          <li><a href="/timeline">Timeline</a> &middot; <a href="/profile">Profile</a></li>
          <li>Create posts, reply, like, repost, upload images</li>
          <li>Explore custom feeds and labels</li>
        </ul>
        <p>
          This is a scaffold. Wire up auth and API calls in
          <code> packages/shared </code> and pages/components.
        </p>
      </main>
    </>
  );
}
