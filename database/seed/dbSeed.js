const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect(process.env.TESTMONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost/levelup');

const db = mongoose.connection;


db.collection('initialChallenges').drop();
db.collection('courseChallenges').drop();
db.collection('userChallenges').drop();

// creates new collection of initialTests with data loated in data.json
const docs = fs.readFile('./initialChallenges.json', 'utf8', (err, data) => {
  console.log(data);
  const items = db.collection('initialChallenges');
  items.insert(JSON.parse(data), (err, docs) => {
    items.count((err, count) => {
      console.log(`${count} challenges inserted into initialChallenges collection.`);
      const courseDocs = fs.readFile('./levelOneChallenges.json', 'utf8', (err, data) => {
        const collection = db.collection('courseChallenges');
        collection.insert(JSON.parse(data), (err, docs) => {
          collection.count((err, count) => {
            console.log(`${count} items inserted into courseChallenges collection.`);
            const challengeDocs = fs.readFile('./allChallenges.json', 'utf8', (err, data) => {
              const col = db.collection('userChallenges');
              col.insert(JSON.parse(data), (err, docs) => {
                col.count((err, count) => {
                console.log(`${count  } items inserted into userChallenges collection.`);
                db.close();
                });
              });
            });
          });
        });
      });
    });
  });
});

