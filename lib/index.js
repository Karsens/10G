/**
 * Challenge I: Apollo Server
1. GraphQL Server Locally
- Code .gitignore, yarn init, git init
- Go to dev.apollodata.com and add index (schema, express, graphiql), schema, resolvers (add resolving-undefined-logging!)
- Create yarn dev with nodemon and babel-cli, add dev dependencies, add normal dependencies
- Run it, try graphiql
- Go to docs.sequelizejs.com and add connectors and its dependencies
- Think about CRUD, change schema and resolvers
- Test them in GraphiQL

SIDESTEPS:
- plugins ESLint, Prettier, Babel, TypeScript
- integration testing
- typescript 

2) Beta-ready GraphQL Server Remotely on Linode
[- git prepush run tests in package.json]
- git push to a GitHub repo
- add linode, setup (initiate secure Ubuntu 16.04 server), or login at one
- install git, nodejs, yarn 
- setup basic nginx to IP
- git pull
- git hook to auto-pull new updates
[- pm2 (put it in dependencies under yarn start)]

 */
import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';
import Sequelize from 'sequelize';

// ===========CONNECTORS=============

const sequelize = new Sequelize('', '', '', {
  host: 'localhost',
  dialect: 'sqlite',//mysql eventually
  storage: 'db.sqlite'
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});

const Post = sequelize.define('post', {
    user: {
      type: Sequelize.STRING
    },
    text: {
      type: Sequelize.STRING
    },
    channel: {
        type: Sequelize.STRING
    },
  });
  
  Post.sync({force: true}).then(() => {
    return Post.create({
      user: 'John',
      text: 'Hoi hoi hoi',
      channel: 'Tarifa',
    });
  });


// ===========SCHEMA==============
const typeDefs = `
type Post {
  id: Int!
  user: String
  text: String
  channel: String
  createdAt: String
}

type Query {
  posts(channel: String!): [Post]
}

type Mutation {
  createPost (user: String!, text: String!, channel: String!): Post
}
`;


// ===========RESOLVERS==============
const resolvers = {
  Query: {
    posts: (_, {channel}) => Post.findAll({
        where: {channel},
        order: [['createdAt', 'DESC']]  
    }),
  },
  Mutation: {
    createPost: (_, { user, text, channel }) => {
      const post = Post.create({user, text, channel});
      if (!post) {
        throw new Error(`Couldn't create post`);
      }
      return post;
    },
  }
};



// ============== EXECUTE ON EXPRESS ===============
const logger = { log: log => console.log('KWERRIE:' + log) };
const allowUndefinedInResolve = false;
export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger,
  allowUndefinedInResolve,
});

var app = express();
const PORT = 3000;
const endpointURL = '/graphql';
app.use('/graphiql', graphiqlExpress({endpointURL}));
app.use(endpointURL, bodyParser.json(), graphqlExpress({ schema }));
app.listen(3000);
console.log('We are listening on 3k');