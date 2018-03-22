var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://localhost/levelup');

var db = mongoose.connection;


db.collection('initialChallenges').drop();
db.collection('courseChallenges').drop();

//creates new collection of initialTests with data loated in data.json
var docs = fs.readFile('initialChallenges.json', 'utf8', function (err, data) {
  var items = db.collection('initialChallenges');
  items.insert(JSON.parse(data), function (err, docs) {
    items.count(function (err, count) {
      console.log(count + " challenges inserted into initialChallenges collection.");
      var courseDocs = fs.readFile("levelOneChallenges.json", "utf8", function(err, data) {
        var collection = db.collection("courseChallenges");
        collection.insert(JSON.parse(data), function(err, docs) {
          collection.count(function(err, count) {
            console.log(count + " items inserted into courseChallenges collection.");
            db.close();
          })
        })
      })
    });
  });
});

