const functions = require(`firebase-functions`);
const admin = require(`firebase-admin`);
const moment = require("moment");
const axios = require("axios");


admin.initializeApp(functions.config().firebase)
const database = admin.firestore()
const messaging = admin.messaging()

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function getNotificationDocument () {
  try {
    const querySnapshot = await database.collection('notificationList').get()

    let today = querySnapshot.docs.filter(doc => {
      return moment().isSame(doc.data().deadline, 'day')
    }).map(doc => {
      return {
        notificationKey: doc.data().notificationKey,
        title: doc.data().title,
        id: doc.id
      }
    })

    let tomorrow = querySnapshot.docs.filter(doc => {
      return moment().add(1, 'days').isSame(doc.data().deadline, 'day')
    }).map(doc => {
      return {
        notificationKey: doc.data().notificationKey,
        title: doc.data().title,
        id: doc.id
      }
    })

    let over = querySnapshot.docs.filter(doc => {
      return moment().subtract(1, 'days').isSameOrAfter(doc.data().deadline, 'day')
    }).map(doc => {
      return {
        notificationKey: doc.data().notificationKey,
        title: doc.data().title,
        id: doc.id
      }
    })

    return {today: today, tomorrow: tomorrow, over: over}
  } catch (error) {
    throw error
  }
}

async function pushNotificationTodaysDeadlineDocument(documents) {
  const url = "https://fcm.googleapis.com/fcm/send"
  const headers = {
    'Authorization': 'key=' + functions.config().vue_app.server_key,
  }

  try{
    for(let document of documents) {
      let data = {
        "notification": {
          "title": "「" + document.title + "」は今日締め切りです",
          "click_action": "result/" + document.id
        },
        "to": document.notificationKey
      }

      axios.post(url, data, {headers: headers, useCredentails: true})

      await sleep(2000)
    }

    return documents
  } catch (error) {
    throw error.response.status
  }

}

async function pushNotificationTomorrowDeadlineDocument(documents) {
  const url = "https://fcm.googleapis.com/fcm/send"
  const headers = {
    'Authorization': 'key=' + functions.config().vue_app.server_key,
  }

  try{
    for(let document of documents) {
      let data = {
        "notification": {
          "title": "「" + document.title + "」は明日締め切りです",
          "click_action": "result/" + document.id
        },
        "to": document.notificationKey
      }

      axios.post(url, data, {headers: headers, useCredentails: true})

      await sleep(2000)
    }

    return documents
  } catch (error) {
    throw error.response.status
  }
}

function deleteOverDeadlineDocument(documents) {
  try {
    documents.forEach(document => {
      database.collection('notificationList').doc(document.id).delete()
    })
    return documents
  } catch (error) {
    throw error
  }
}


//通知処理
exports.pushNotification = functions.https.onRequest(async (request, response) => {
  try{
    const res = await getNotificationDocument()
    const today = await pushNotificationTodaysDeadlineDocument(res.today)
    const tomorrow = await pushNotificationTomorrowDeadlineDocument(res.tomorrow)
    const deleteDocument = await deleteOverDeadlineDocument(res.over)

    response.send({today: today, tomorrow: tomorrow, deleteDocument: deleteDocument})
  } catch (error) {
    response.status(500).send(error)
  }
})
