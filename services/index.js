import { request, gql } from 'graphql-request';

// Creates our graphql API by using the endpoint from our env
const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;

// const graphqlAPI = 'https://api-us-west-2.graphcms.com/v2/ckvn962nt1wb701z280an9cyw/master';

export const getPosts = async () => {
  const query = gql`
    query MyQuery {
      postsConnection {
        edges {
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
  `

  // This fetches the posts
  const result = await request(graphqlAPI, query);

  // These are the posts
  return result.postsConnection.edges;
};


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

// Get Categories
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