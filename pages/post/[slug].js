// NextJs has 'file based routing' which means we don't have to do all the routing like we usually would. 
// Meaning we don't have to do all the routing that we would usually do inside of 'app.js' using React-Router-DOM.
// With NextJS we just put our files as we want them to be structured later on in the actual URL
// eg: indexJS shows when we go to localhost3000, and when we create a folder called 'Post' the URL will be /post. So localhost:3000/post
// So if we create a slug specifically with square brackets, that means it will be dynamic. So if you go to localhost:3000/post/1234, the application will think of 1234 as the slug, and render what's in the slug file. 

import React from 'react';

import { getPosts, getPostDetails } from '../../services';
import { PostDetail, Categories, PostWidget, Author, Comments, CommentsForm } from '../../components';

const PostDetails = ({ post }) => {

  console.log(post);

  return (
    <div className='container mx-auto px-10 mb-8'>
      <div className='grid grid-cols-1 lg:grid-cols-12 gap-12'>
        <div className='col-span-1 lg:col-span-8'>
          <PostDetail post={post}/>
          <Author author={post.author} />
          <CommentsForm slug={post.slug} />
          <Comments slug={post.slug} />
        </div>
        <div className='col-span-1 lg:col-span-4'>
          <div className='relative lg:sticky top-8'>
            <PostWidget slug={post.slug} categories={post.categories.map((category) => category.slug)} />
            <Categories />            
          </div>
        </div>
      </div>
    </div>
  )
}

export default PostDetails

// Here, the { params } is a slug
// In NextJS, we get what we pass to 'props: { post: data}' as props in the PostDetails component.
export async function getStaticProps({ params }) {
  const data = await getPostDetails(params.slug);

  return {
    props: { post: data }
  }
}

// Without 'getStaticPaths', we will get an error that says 'Error: getStaticPaths is required for dynamic SSG pages and is missing for '/post/[slug]'
// This will allow our NextJS application to know all of the possible paths we can go to
export async function getStaticPaths() {
  const posts = await getPosts();

  return {
    paths: posts.map(({ node: {slug}}) => ({ params: { slug }})),
    fallback: false, 
  }
}