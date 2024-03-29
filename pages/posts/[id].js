import Head from 'next/head';
import Navbar from '../../components/header';
import { getAllPostIds, getPostData } from '../../lib/posts';
import styles from '../../styles/Home.module.css'
import Comments from '../../components/comment';
import GoogleAnalytics from '../../components/google-analytics';
import { Analytics } from '@vercel/analytics/react'
import AdBanner from '../../components/ad-banner';

export default function Post({ postData, id }) {
    return (
      <>
        <Head>
          <title>{postData.title}</title>
          <meta name="viewport" content="width=device-width, initial-scale=1"></meta>
          <link rel="canonical" href={"https://blog.fengqijun.me/posts/"  + id} />
        </Head>
        
        <main className={styles.main}>
          <Navbar></Navbar>
          <article className={styles.article}>
            <header>
              <h1>{postData.title}</h1>
              <p className={styles.date}>
               {new Date(postData.date).toLocaleDateString("zh-CN")}
              </p>
            </header>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
            <AdBanner
              data-ad-slot="1641482906"
              data-ad-format="auto"
              data-full-width-responsive="true"
            ></AdBanner>
            <h2 className={styles.comments}>Comments</h2>
            <Comments />
          </article>
          <GoogleAnalytics></GoogleAnalytics>
          <Analytics></Analytics>
        </main>
      </>
    );
  }

export async function getStaticProps({ params }) {
    const postData = await getPostData(params.id);
    return {
      props: {
        postData,
        id: params.id
      },
    };
  }

export async function getStaticPaths() {
    const paths = getAllPostIds();
    return {
      paths,
      fallback: false,
    };
  }