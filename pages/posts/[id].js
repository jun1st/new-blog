import Head from 'next/head';
import Date from '../../components/date';
import { getAllPostIds, getPostData } from '../../lib/posts';

export default function Post({ postData }) {
    return (
      <>
        <Head>
          <title>{postData.title}</title>
        </Head>
        <div>
          {postData.title}
          <br />
          {postData.id}
          <br />
          <Date dateString={postData.date} />
          <br/>
          <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} />
        </div>
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