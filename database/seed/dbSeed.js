var fs = require('fs');
var mongoose = require('mongoose');
mongoose.connect(process.env.TESTMONGO_URI || process.env.MONGODB_URI || 'mongodb://localhost/levelup');

var db = mongoose.connection;


db.collection('initialChallenges').drop();
db.collection('courseChallenges').drop();
db.collection('userchallenges').drop();

//creates new collection of initialTests with data loated in data.json
var docs = fs.readFile('./database/seed/initialChallenges.json', 'utf8', function (err, data) {
  console.log(data);
  var items = db.collection('initialChallenges');
  items.insert(JSON.parse(data), function (err, docs) {
    items.count(function (err, count) {
      console.log(count + " challenges inserted into initialChallenges collection.");
      var courseDocs = fs.readFile("./database/seed/levelOneChallenges.json", "utf8", function(err, data) {
        var collection = db.collection("courseChallenges");
        collection.insert(JSON.parse(data), function(err, docs) {
          collection.count(function(err, count) {
            console.log(count + " items inserted into courseChallenges collection.");
            var challengeDocs = fs.readFile("./database/seed/allChallenges.json", "utf8", function(err, data) {
              var col = db.collection("userchallenges");
              col.insert(JSON.parse(data), function(err, docs) {
                col.count(function(err, count) {
                console.log(count + " items inserted into userchallenges collection.");
                db.close();
              })
            })
          })
        })
      })
    });
  });
});
});

