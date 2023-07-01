import Head from 'next/head';
import { getAllPostIds, getPostData } from '../../lib/posts';
import styles from '../../styles/Home.module.css'

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
          </article>
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