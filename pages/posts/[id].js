import Head from 'next/head';
import { getAllPostIds, getPostData } from '../../lib/posts';
import styles from '../../styles/Home.module.css'
import Header from '../../components/header'
import Comments from '../../components/comment';
import GoogleAnalytics from '../../components/google-analytics';
import { Analytics } from '@vercel/analytics/react'

export default function Post({ postData }) {
    return (
      <>
        <Head>
          <title>{postData.title}</title>
        </Head>
        
        <main className={styles.main}>
          <Header></Header>
          <article className={styles.article}>
            <header>
              <h1>{postData.title}</h1>
              <p className={styles.date}>
               {new Date(postData.date).toLocaleDateString("zh-CN")}
              </p>
            </header>
            <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
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