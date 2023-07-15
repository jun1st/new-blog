import Head from 'next/head'
import Script from 'next/script';
import { getSortedPostsData } from '../lib/posts'

import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Header from '../components/header'
import GoogleAnalytics from '../components/google-analytics'
import { Analytics } from '@vercel/analytics/react'


const inter = Inter({ subsets: ['latin'] })

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
          <Script
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-0114708860946019"
          crossOrigin="anonymous"
        />
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
