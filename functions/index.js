const functions = require("firebase-functions");
const firebase = require("firebase-admin");
const express = require("express");
var cors = require("cors");
const app = express();
var bodyParser = require("body-parser");

app.use(cors());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({ extended: false });

const firebaseApp = firebase.initializeApp({
  credential: firebase.credential.cert({
    type: functions.config().fbserviceaccount.type,
    project_id: functions.config().fbserviceaccount.project_id,
    private_key_id: functions.config().fbserviceaccount.private_key_id,
    private_key: functions
      .config()
      .fbserviceaccount.private_key.replace(/\\n/g, "\n"),
    client_email: functions.config().fbserviceaccount.client_email,
    client_id: functions.config().fbserviceaccount.client_id,
    auth_uri: functions.config().fbserviceaccount.auth_uri,
    token_uri: functions.config().fbserviceaccount.token_uri,
    auth_provider_x509_cert_url: functions.config().fbserviceaccount
      .auth_provider_x509_cert_url,
    client_x509_cert_url: functions.config().fbserviceaccount
      .client_x509_cert_url,
  }),
});

app.get("/copy/:alias", (request, response) => {
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
});

exports.app = functions.https.onRequest(app);
