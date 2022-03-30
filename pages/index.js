import Head from 'next/head';
import { PostCard, Categories, PostWidget } from '../components';
import { getPosts } from '../services';
import { FeaturedPosts } from '../sections';

// We get our posts here from the props and loop over them, passing each post one by one into the PostCard component
export default function Home({ posts }) {
  return (
    <div className='container mx-auto px-10 mb-8'>
      <Head>
        <title>Petrol Notes</title>
        <link rel="icon" href='/favicon-96x96.png' />
      </Head>
      <FeaturedPosts />
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='lg:col-span-8 col-span-1'>
          {posts.map((post) => <PostCard post={post.node} key={post.title} />)}
        </div>
        <div className='lg:col-span-4 col-span-1'>
          <div className='lg:sticky relative top-8' >
            <PostWidget />
            <Categories />            
          </div>
        </div>
      </div>
    </div>
  )
}

// This is the Nextjs way to fetch data inside of our components
// Here we fetch our posts
export async function getStaticProps() {
  const posts = (await getPosts()) || [];

  return {
    props: { posts }
  }
}