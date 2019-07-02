const functions = require(`firebase-functions`);
const admin = require(`firebase-admin`);
const moment = require("moment");
const axios = require("axios");


admin.initializeApp(functions.config().firebase)
const database = admin.firestore()
const messaging = admin.messaging()

function getNotificationDocument () {
  return new Promise((resolve, reject) => {
    database.collection('notificationList').get()
      .then((querySnapshot) => {
          let today = querySnapshot.docs.filter(doc => {
            return moment().isSame(doc.data().deadline, 'day')
          }).map(doc => {
            return {
              data: doc.data(),
              id: doc.id
            }
          })

          let tomorrow = querySnapshot.docs.filter(doc => {
            return moment().add(1, 'days').isSame(doc.data().deadline, 'day')
          }).map(doc => {
            return {
              data: doc.data(),
              id: doc.id
            }
          })

          let over = querySnapshot.docs.filter(doc => {
            return moment().subtract(1, 'days').isSameOrAfter(doc.data().deadline, 'day')
          }).map(doc => {
            return {
              data: doc.data(),
              id: doc.id
            }
          })

        return resolve({today: today, tomorrow: tomorrow, over: over})
      }).catch(reject)
  })
}

function pushNotificationTodaysDeadlineDocument(documents) {
  return new Promise((resolve, reject) => {
    let response = []
    const url = "https://fcm.googleapis.com/fcm/send"
    documents.forEach(document => {
      let headers = {
        'Authorization': 'key=' + functions.config().vue_app.server_key,
      }

      let data = {
        "notification": {
          "title": "「" + document.data.title + "」は今日締め切りです",
          "click_action": "result/" + document.id
        },
        "to": document.data.notificationKey
      }

      axios.post(url, data, {headers: headers, useCredentails: true})
        .then(res => {
        response.push(res.data)
        return null
        }).catch(reject)
    })
    resolve(response)
  })
}

function pushNotificationTomorrowDeadlineDocument(documents) {
  return new Promise((resolve, reject) => {
    let response = []
    const url = "https://fcm.googleapis.com/fcm/send"
    documents.forEach(document => {
      let headers = {
        'Authorization': 'key=' + functions.config().vue_app.server_key,
      }

      let data = {
        "notification": {
          "title": "「" + document.data.title + "」は明日締め切りです",
          "click_action": "result/" + document.id
        },
        "to": document.data.notificationKey
      }

      axios.post(url, data, {headers: headers, useCredentails: true})
        .then(res => {
        response.push(res.data)
        return null
        }).catch(reject)
    })
    resolve(response)
  })
}

function deleteOverDeadlineDocument(documents) {
  return new Promise((resolve, reject) => {
    documents.forEach(document => {
      database.collection('notificationList').doc(document.id).delete()
        .then(() => {
          return null
        }).catch(reject)
    })
    resolve()
  })
}


//通知処理
exports.pushNotification = functions.https.onRequest((request, response) => {
  getNotificationDocument().then(res => {
    return Promise.all([pushNotificationTodaysDeadlineDocument(res.today),
                        pushNotificationTomorrowDeadlineDocument(res.tomorrow),
                        deleteOverDeadlineDocument(res.over)])
  }).then(res => {
    response.send(res)
    return null
  }).catch(err => {
    response.send('err:' + err)
  })
})
