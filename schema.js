const typeDefs = `
type Post {
  id: Int!
  user: String
  text: String
  channel: String
  createdAt: String
}
# the schema allows the following query:
type Query {
  posts(channel: String!): [Post]
}

# this schema allows the following mutation:
type Mutation {
  createPost (user: String!, text: String!, channel: String!): Post
}
`;

export default typeDefs;