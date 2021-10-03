const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const dbUrl = "mongodb://localhost:27017";
const dbName = "Test";

MongoClient.connect(
  dbUrl,
  { useUnifiedTopology: true, useNewUrlParser: true },
  (error, result) => {
    if (error) {
      return console.log("Not connected to db...");
    } else {
      console.log("Connected to Db");
      const db = result.db(dbName);
      db.collection("Users").insertOne(
        {
          name: "Burak",
          age: 34,
          gender: true,
        },
        (error, result) => {
          if (error) {
            console.log("Error occured.Data could not be added" + error);
          } else {
            console.log(result);
            //console.log(result.ops,result.insertedCount );
          }
        }
      );

      db.collection("Users")
        .insertOne({
          name: "Unal",
          age: 30,
          gender: false,
        })
        .then((result) => {
          console.log("Promise is successfull " + result);
        })
        .catch((e) => {
          console.log("Promise error " + e);
          
        });
    }
  }
);
