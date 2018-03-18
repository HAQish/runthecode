var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/levelup');

var db = mongoose.connection;


db.collection('initialChallenges').drop();

//creates new collection of initialTests with data loated in data.json
var docs = fs.readFile('initialChallenges.json', 'utf8', function (err, data) {
  var items = db.collection('initialChallenges');
  console.log(data)
  items.insert(JSON.parse(data), function (err, docs) {
    items.count(function (err, count) {
      console.log(count + "[" + data + "]");
      db.close();
    });
  });
});