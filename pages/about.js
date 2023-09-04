import Head from 'next/head'


import Navbar from '../components/header'
import styles from '../styles/Home.module.css'

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
        <link rel="canonical" href="https://blog.fengqijun.me" />
      </Head>
      <main className={styles.main}>
        <Navbar></Navbar>
        {/* Add this <section> tag below the existing <section> tag */}
        <h1>About me</h1>
        
        <GoogleAnalytics></GoogleAnalytics>
        <Analytics></Analytics>
      </main>
    </>
  )
}

