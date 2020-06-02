const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const express = require("express");
var cors = require("cors");
var path = require("path");
var public = path.join(__dirname, "public");
const app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const firebaseApp = firebase.initializeApp();

app.get("/copy/:alias", (request, response) => {
  response.sendFile(path.join(public, "copy.html"));
});

app.get("/api/copy/:alias", (request, response) => {
  try {
    var db = firebaseApp.database();
    var ref = db.ref("copy/" + request.params.alias);

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
  } catch (_err) {
    return response.end(JSON.stringify(_err));
  }
});

app.post("/api/copy/:alias", (request, response) => {
  try {
    var db = firebaseApp.database();
    var ref = db.ref("copy/" + request.params.alias);
    var value = request.body.value;

    // Attach an asynchronous callback to read the data at our posts reference
    ref.set(request.body)
    .then(_res => {
      return response.end("Success");
    })
    .catch(_err => {
      return response.end(JSON.stringify(_err));
    });
  } catch (_err) {
    return response.end(JSON.stringify(_err));
  }
});

exports.app = functions.https.onRequest(app);
