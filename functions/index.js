const functions = require(`firebase-functions`);
const admin = require(`firebase-admin`);
const moment = require("moment");


admin.initializeApp(functions.config().firebase)
const database = admin.firestore()
// database.settings({
//   timestampsInSnapshots: true
// });

function getNotification () {
  return new Promise((resolve, reject) => {
    database.collection('notificationList').get()
      .then((querySnapshot) => {
          let notification = querySnapshot.docs.filter(doc => {
            return moment().isSame(doc.data().deadline, 'day')
          }).map(doc => {
            return {
              data: doc.data(),
              id: doc.id
            }
          })

          let beforeNotification = querySnapshot.docs.filter(doc => {
            return moment().add(1, 'days').isSame(doc.data().deadline, 'day')
          }).map(doc => {
            return {
              data: doc.data(),
              id: doc.id
            }
          })
        return resolve({notification: notification, beforeNotification: beforeNotification})
      }).catch(reject)
  })
}

function deleteNotificationList (id) {
  return new Promise((resolve, reject) => {
    database.collection('notificationList').doc(id).delete()
      .then(() => {
        return resolve()
      }).catch(reject)
  })
}

function addNotification (documents) {
  return new Promise((resolve, reject) => {
    documents.forEach(document => {
      database.collection('notification').doc(document.id)
        .set(document.data)
        .then(() => {
          return deleteNotificationList(document.id)
        }).catch(reject)
    })
    resolve()
  })
}

function addBeforeNotification (documents) {
  return new Promise((resolve, reject) => {
    documents.forEach(document => {
      database.collection('beforeNotification').doc(document.id)
        .set(document.data)
        .catch(reject)
    })
    resolve()
  })
}

function deleteNotification (id) {
  return new Promise((resolve, reject) => {
    database.collection('notification').doc(id).delete()
      .then(() => {
        return resolve()
      }).catch(reject)
  })
}

function deleteBeforeNotification (id) {
  return new Promise((resolve, reject) => {
    database.collection('beforeNotification').doc(id).delete()
      .then(() => {
        return resolve()
      }).catch(reject)
  })
}

//通知用のテーブルに通知するdocumentを追加
exports.addNotificationToDatabase = functions.https.onRequest((request, response) => {
  getNotification().then(res => {
    addNotification(res.notification)
    addBeforeNotification(res.beforeNotification)
    response.send(res)
    return null
  }).catch(() => {
    response.send('error!')
  })
})
