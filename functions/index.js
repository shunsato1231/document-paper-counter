const functions = require(`firebase-functions`);
const admin = require(`firebase-admin`);
admin.initializeApp();
const db = admin.database();

//Httpトリガの関数（今回はこれを紹介したかっただけ）
exports.hoga = functions.https.onRequest((req, res) => {

  console.log('受信')

});
