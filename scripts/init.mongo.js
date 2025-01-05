/*
 * Run using the mongo shell. For remote databases, ensure that the
 * connection string is supplied in the command line. For example:
 * localhost:
 *   mongo issuetracker scripts/init.mongo.js
 * Atlas:
 *   mongo mongodb+srv://user:pwd@xxx.mongodb.net/issuetracker scripts/init.mongo.js
 * MLab:
 *   mongo mongodb://user:pwd@xxx.mlab.com:33533/issuetracker scripts/init.mongo.js
 */

db.users.remove({});   //Remove all documents from the users collection

db.users.insertOne(
    {
        id: 1,
        email: "test_email@gmail.com",
        fullName: "Test User",
    }
);

const count = db.users.count();
print('Inserted', count, 'Users');

//The _id below is just a placeholder. The below collection, in fact, has only one row and one column. We can denote this by any name but we call this fixedindex.
db.counters.remove({ _id: 'fixedindex' });
db.counters.insert({ _id: 'fixedindex', current: count });
//make search more efficiently by creating indexes
db.users.createIndex({ id: 1 }, { unique: true });
db.users.createIndex({ name: 1 });
db.users.createIndex({ phone: 1 });
db.users.createIndex({ bookingTime: 1 });