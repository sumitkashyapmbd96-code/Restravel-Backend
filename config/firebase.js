const admin = require("firebase-admin");

const serviceAccount = require("../firebaseServiceKey.json");

admin.initializeApp({
  credential: admin.cert(serviceAccount), // ✅ CHANGE HERE
});

module.exports = admin;