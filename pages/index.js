import Head from 'next/head'
import Image from 'next/image'
import { getSortedPostsData } from '../lib/posts'

import { Inter } from '@next/font/google'
import styles from '../styles/Home.module.css'
import Link from 'next/link'
import Header from '../components/header'


const inter = Inter({ subsets: ['latin'] })

export default function Home({allPostsData}) {
  return (
    <>
      <Head>
        <title>fengd's personal zone</title>
        <meta name="description" content="fengde's personal blog" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Header></Header>
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
