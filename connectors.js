const Sequelize = require('sequelize');
const sequelize = new Sequelize('', '', '', {
  host: 'localhost',
  dialect: 'sqlite',//mysql eventually

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
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
  
  // force: true will drop the table if it already exists
  Post.sync({force: true}).then(() => {
    // Table created

    return Post.create({
      user: 'John',
      text: 'Hoi hoi hoi',
      channel: 'Tarifa',
    });
  });

export { Post };