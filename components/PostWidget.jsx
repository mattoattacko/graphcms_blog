import React, { useState, useEffect } from 'react';
import moment from 'moment';
import Link from 'next/link';

import { getRecentPosts, getSimilarPosts } from '../services'

const PostWidget = ({ categories, slug }) => {
  const [relatedPosts, setRelatedPosts] = useState([]);

  // We want to know if we are seeing the PostWidget on the homepage, or in a specific articles page because...
  // On the homepage we see the most Recent Posts 
  // But if we go to the actual articles page, we should see Related Posts
  // To know the difference we can check the slug, which we pass in to the PostWidget component
  // The slug is the path of the specific article 

  // We wanted to get similar or related posts if we have a slug (eg: if we are viewing a certain article at the moment)
  // If we are not, then we get recent posts instead
  useEffect(() => {
    if(slug) {
      getSimilarPosts(categories, slug)
        .then((result) => setRelatedPosts(result))
    } else {
      getRecentPosts()
      .then((result) => setRelatedPosts(result))
    }
  }, [slug])

  return (
    <div className='bg-white shadow-lg rounded-lg p-8 mb-8'>
      <h3 className='text-xl mb-8 font-semibold border-b pb-4'>
        {slug ? 'Related Posts' : 'Recent Posts'}
      </h3>
      {relatedPosts.map((post) => (
        <div key={post.title} className='flex items-center w-full mb-4'>
          <div className='w-16 flex-none'>
            <img 
              src={post.featuredImage.url}
              alt={post.title}
              height='60px'
              width='60px'
              className='align-middle rounded-full'
            />
          </div>
          <div className='flex-grow ml-4'>
            <p className='text-gray-500 font-xs'>
              {moment(post.date).format('MMM DD, YYYY')}
            </p>
            <Link href={`/post/${post.slug}`} key={post.title} className='text-md'>
              {post.title}
            </Link>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PostWidget
