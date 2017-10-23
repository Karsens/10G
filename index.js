import express from 'express';
import bodyParser from 'body-parser';
import { graphqlExpress, graphiqlExpress } from 'apollo-server-express';
import { makeExecutableSchema } from 'graphql-tools';


import typeDefs from './schema';
import resolvers from './resolvers';

const logger = { log: log => console.log(log) };
const allowUndefinedInResolve = false;

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
  logger,
  allowUndefinedInResolve,
});

// guys, can I have a small keyboard up there? you would be able to see my key shortcuts 
// wow. I can't believe I diddn't make any mistakes! :O 
const PORT = 3000;
var app = express();

app.use('/graphiql', graphiqlExpress({
    endpointURL: '/graphql',
  }));
  
app.use('/graphql', bodyParser.json(), graphqlExpress({ schema }));
app.listen(PORT);
console.log('we listen on 3k!');