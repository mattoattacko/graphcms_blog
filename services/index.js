import { request, gql } from 'graphql-request';

// Creates our graphql API by using the endpoint from our env
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

// Get Posts //
export const getPosts = async () => {
  const query = gql`
    query MyQuery {
      postsConnection {
        edges {
          cursor
          node {
            author {
              bio
              name
              id
              photo {
                url
              }
            }
            createdAt
            slug
            title
            excerpt
            featuredImage {
              url
            }
            categories {
              name
              slug
            }
          }
        }
      }
    }
  `;

  // This fetches the posts
  const result = await request(graphqlAPI, query);

  // These are the posts
  return result.postsConnection.edges;
};

// Get Post Details //
// '$slug: String!' means we are accepting a slug that will be a string
// 'post(where: { slug: $slug })'  means we only want to get that specific article
// 'content {raw}' gives us access to the post content
export const getPostDetails = async (slug) => {
  const query = gql`
    query GetPostDetails($slug: String!) { 
      post(where: {slug: $slug}) {
        author {
          bio
          name
          id
          photo {
            url
          }
        }
        createdAt
        slug
        title
        excerpt
        featuredImage {
          url
        }
        categories {
          name
          slug
        }
        content {
          raw
        }
      }
    }
  `

  // This fetches the posts
  const result = await request(graphqlAPI, query, { slug });

  // These are the posts
  return result.post;
};

// Get Recent Posts //
// Gets the newest posts as they are created
export const getRecentPosts = async () => {
  const query = gql`
    query GetPostDetails() {
      posts(
        orderBy: createdAt_DESC
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `

  const result = await request(graphqlAPI, query);

  return result.posts;
}

// Get Similar Posts //
// slug_not = dont display the current article but display other articles that display some of the categories related
export const getSimilarPosts = async (categories, slug) => {
  const query = gql`
    query GetPostDetails($slug: String!, $categories: [String!]) {  
      posts(
        where: { slug_not: $slug, AND: { categories_some: { slug_in: $categories}}}
        last: 3
      ) {
        title
        featuredImage {
          url
        }
        createdAt
        slug
      }
    }
  `
  const result = await request(graphqlAPI, query, { slug, categories });

  return result.posts;
}

// Get Categories //
export const getCategories = async () => {
  const query = gql`
    query GetCategories {
      categories {
        name
        slug
      }
    }
  `

  const result = await request(graphqlAPI, query);

  return result.categories;
}

// Submit Comment //
// We make an HTTP request to our own next.js backend
// we send a stringified object to our own backend
export const submitComment = async (obj) => {
  const result = await fetch('/api/comments' , {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify(obj),
  });
  return result.json();
}

// We need to create our own backend point that will accept the comment and do something with it
// We need a backend because GraphCMS allows our own backend to interact with our service to actually submit a comment to GraphCMS. Then we will be able to see and approve/disapprove it from the GraphCMS dashboard.

// Get Comments //
// For the 'GetComments($slug...)' function, we are trying to get all the comments where in an object post, again in an object has this slug.
// Once we do get the comments, we can fetch them and get the data we want.
export const getComments = async (slug) => {
  const query = gql`
    query GetComments($slug: String!) { 
     comments(where: { post: { slug: $slug } }) { 
       name
       createdAt
       comment
     }
    }
  `
  const result = await request(graphqlAPI, query, { slug });

  return result.comments;
}

// Get Featured Posts //
// Its a query where we get the post where the boolean value 'featuredPost' is set to true. Then pull out all the data we requested for that specific post. Finally, return it. 
export const getFeaturedPosts = async () => {
  const query = gql`
    query GetCategoryPost() {
      posts(where: {featuredPost: true}) {
        author {
          name
          photo {
            url
          }
        }
        featuredImage {
          url
        }
        title
        slug
        createdAt
      }
    }   
  `;

  const result = await request(graphqlAPI, query);

  return result.posts;
};

// Get Adjacent Posts //
// export const getAdjacentPosts = async (createdAt, slug) => {
//   const query = gql`
//     query GetAdjacentPosts($createdAt: DateTime!,$slug:String!) {
//       next:posts(
//         first: 1
//         orderBy: createdAt_ASC
//         where: {slug_not: $slug, AND: {createdAt_gte: $createdAt}}
//       ) {
//         title
//         featuredImage {
//           url
//         }
//         createdAt
//         slug
//       }
//       previous:posts(
//         first: 1
//         orderBy: createdAt_DESC
//         where: {slug_not: $slug, AND: {createdAt_lte: $createdAt}}
//       ) {
//         title
//         featuredImage {
//           url
//         }
//         createdAt
//         slug
//       }
//     }
//   `;

//   const result = await request(graphqlAPI, query, { slug, createdAt });

//   return { next: result.next[0], previous: result.previous[0] };
// };