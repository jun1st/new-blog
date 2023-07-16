import Head from 'next/head';
import { getAllPostIds, getPostData } from '../../lib/posts';
import styles from '../../styles/Home.module.css'
import Comments from '../../components/comment';
import GoogleAnalytics from '../../components/google-analytics';
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script';
import AdBanner from '../../components/ad-banner';

export default function Post({ postData }) {
    return (
      <>
        <Head>
          <title>{postData.title}</title>
        </Head>
        
        <main className={styles.main}>
         
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