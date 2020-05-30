const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const express = require("express");
var cors = require("cors");
const app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const firebaseApp = firebase.initializeApp();

app.get("/copy/:alias", (request, response) => {
  try {
  var db = firebaseApp.database();
  var ref = db.ref("copy/yy" + request.params.alias);

  // Attach an asynchronous callback to read the data at our posts reference
  ref.once(
    "value",
    function (snapshot) {
      console.log(snapshot.val());
      return response.end(JSON.stringify(snapshot.val()));
    },
    function (errorObject) {
      console.log("The read failed: " + errorObject.code);
      return response.end(JSON.stringify(errorObject));
    }
  );
  }
  catch (_err){
    return response.end(JSON.stringify(_err));
  }
});


app.get("/copy", (request, response) => {
  return response.end("some value in copy page");
});

exports.app = functions.https.onRequest(app);
