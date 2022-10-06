const { connect, connection } = require('mongoose');

const connectonString = 
    process.env.MONGODB_URI || 'mongob://localhost:27017/socialnetworkDB';

connect(connectonString, {
    useNewUrlParser: true,
    useUnifiedTopogoy: true,
});

module.exports = connection;