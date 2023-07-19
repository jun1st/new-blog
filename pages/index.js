import Head from 'next/head'
import { getSortedPostsData } from '../lib/posts'

import Navbar from '../components/header'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import GoogleAnalytics from '../components/google-analytics'
import { Analytics } from '@vercel/analytics/react'


export default function Home({allPostsData}) {
  return (
    <>
      <Head>
        <title>fengd&apos;s personal zone</title>
        <meta name="description" content="fengde's personal blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        
      </Head>
      <main className={styles.main}>
        <Navbar></Navbar>
        {/* Add this <section> tag below the existing <section> tag */}
        <h1>Recent posts</h1>
        <article className={styles.article}>
          <ul className={styles.posts}>
            {allPostsData.map(({ id, date, title, spoiler }) => (
              <li key={id}>
                <h3>
                  <Link href={`/posts/${encodeURIComponent(id)}`}>{title}</Link>
                </h3>
                <small>
                  {new Date(date).toLocaleDateString("zh-CN")}
                </small>
                <p>
                  {spoiler}
                </p>
              </li>
            ))}
          </ul>
        </article>
        <GoogleAnalytics></GoogleAnalytics>
        <Analytics></Analytics>
      </main>
    </>
  )
}


export async function getStaticProps() {
  const allPostsData = getSortedPostsData();
  return {
    props: {
      allPostsData,
    },
  };
}
