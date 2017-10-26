'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.schema = undefined;

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _apolloServerExpress = require('apollo-server-express');

var _graphqlTools = require('graphql-tools');

var _sequelize = require('sequelize');

var _sequelize2 = _interopRequireDefault(_sequelize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// ===========CONNECTORS=============

var sequelize = new _sequelize2.default('', '', '', {
  host: 'localhost',
  dialect: 'sqlite', //mysql eventually
  storage: 'db.sqlite'
}); /**
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


sequelize.authenticate().then(function () {
  console.log('Connection has been established successfully.');
}).catch(function (err) {
  console.error('Unable to connect to the database:', err);
});

var Post = sequelize.define('post', {
  user: {
    type: _sequelize2.default.STRING
  },
  text: {
    type: _sequelize2.default.STRING
  },
  channel: {
    type: _sequelize2.default.STRING
  }
});

Post.sync({ force: true }).then(function () {
  return Post.create({
    user: 'John',
    text: 'Hoi hoi hoi',
    channel: 'Tarifa'
  });
});

// ===========SCHEMA==============
var typeDefs = '\ntype Post {\n  id: Int!\n  user: String\n  text: String\n  channel: String\n  createdAt: String\n}\n\ntype Query {\n  posts(channel: String!): [Post]\n}\n\ntype Mutation {\n  createPost (user: String!, text: String!, channel: String!): Post\n}\n';

// ===========RESOLVERS==============
var resolvers = {
  Query: {
    posts: function posts(_, _ref) {
      var channel = _ref.channel;
      return Post.findAll({
        where: { channel: channel },
        order: [['createdAt', 'DESC']]
      });
    }
  },
  Mutation: {
    createPost: function createPost(_, _ref2) {
      var user = _ref2.user,
          text = _ref2.text,
          channel = _ref2.channel;

      var post = Post.create({ user: user, text: text, channel: channel });
      if (!post) {
        throw new Error('Couldn\'t create post');
      }
      return post;
    }
  }
};

// ============== EXECUTE ON EXPRESS ===============
var logger = { log: function log(_log) {
    return console.log('KWERRIE:' + _log);
  } };
var allowUndefinedInResolve = false;
var schema = exports.schema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: typeDefs,
  resolvers: resolvers,
  logger: logger,
  allowUndefinedInResolve: allowUndefinedInResolve
});

var app = (0, _express2.default)();
var PORT = 3000;
var endpointURL = '/graphql';
app.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({ endpointURL: endpointURL }));
app.use(endpointURL, _bodyParser2.default.json(), (0, _apolloServerExpress.graphqlExpress)({ schema: schema }));
app.listen(3000);
console.log('We are listening on 3k');