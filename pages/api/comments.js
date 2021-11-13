/** *************************************************************
* Any file inside the folder pages/api is mapped to /api/* and  *
* will be treated as an API endpoint instead of a page.         *
* eg: this page would be an endpoint to /api/comments/          *
*************************************************************** */

import { GraphQLClient, gql } from 'graphql-request';

const graphqlAPI = process.env.NEXT_PUBLIC_GRAPHCMS_ENDPOINT;
const graphcmsToken = process.env.GRAPHCMS_TOKEN;

export default async function comments(req, res) {
  console.log({graphcmsToken});

  const graphQLClient = new GraphQLClient(graphqlAPI, {
    headers: {
      authorization: `Bearer ${graphcmsToken}`
    }
  })

  // Mutation in GraphQL means we are going to update some data, or add some new data like a comment.
  // Once we run this query, it will create a new comment inside of the GraphCMS database.
  const query = gql`
    mutation CreateComment($name: String!, $comment: String!, $email: String!, $slug: String!) {
      createComment(data: { name: $name, email: $email, comment: $comment, post: { connect: { slug: $slug }}}) { id }
    }
  `
  try {
    const result = await graphQLClient.request(query, req.body);

    // returns the result to our FE
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error); 
  }

}
