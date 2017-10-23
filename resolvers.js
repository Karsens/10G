import { find, filter } from 'lodash';
// example data
const authors = [
  { id: 1, firstName: 'Tom', lastName: 'Coleman' },
  { id: 2, firstName: 'Sashko', lastName: 'Stubailo' },
  { id: 3, firstName: 'Mikhail', lastName: 'Novikov' },
];
const posts = [
  { id: 1, authorId: 1, title: 'Introduction to GraphQL', votes: 2 },
  { id: 2, authorId: 2, title: 'Welcome to Meteor', votes: 3 },
  { id: 3, authorId: 2, title: 'Advanced GraphQL', votes: 1 },
  { id: 4, authorId: 3, title: 'Launchpad is Cool', votes: 7 },
];

import { Post } from './connectors';

/**
 * I want to be able to find posts based on channel.
 * 
 * So easy.
 * 
 * I have the bare necesities now. I can create posts and I can search for them based on channels. 
 * How can I return all different channels? not necessary. Just post searching based on the state of your channel!
 * 
 * Deletepost is also not necessary, just automatically limit the amount of posts in the end.
 * 
 * update Post is lso not necessary we just create a new post every time
 * 
 * It's important that the newest comes first. I think we can do something in the resolve for that. Order or something.
 * 
 * Also, what about the date (createdAt)
 * 
 * 
 * It does exactly what we want & need! We're quite done!
 * 
 * Let's continue with the next thing.
 */
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

export default resolvers;