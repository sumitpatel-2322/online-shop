const expressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(expressSession);

function createSessionStore() {
  const store = new MongoDBStore({
    uri: process.env.MONGODB_URI,
    databaseName: 'online-shop',
    collection: 'sessions'
  });

  store.on('error', function(error) {
    console.error('Session store error:', error);
  });

  return store;
}

function createSessionConfig() {
  return {
    secret: 'super-secret',     // Use a strong secret, ideally stored in env variables
    resave: false,
    saveUninitialized: false,
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    }
  };
}

module.exports = createSessionConfig;
