const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

var database = admin.firestore()

exports.countWebTool = functions.firestore.document('tools/web/manipulators/{id}').onWrite((change, context) => {
  var docRef = database.doc('tools/web')
  var type, all_count, csl_count, cu3_count, mpd_count, pdp_count, trello_count

  // check create, update, delete
  if (!change.before.exists) {
    // create
    type = change.after.data().type

    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      all_count = doc.data().all_count + 1
      csl_count = type.csl ? doc.data().csl_count + 1 : doc.data().csl_count
      cu3_count = type.cu3 ? doc.data().cu3_count + 1 : doc.data().cu3_count
      mpd_count = type.mpd ? doc.data().mpd_count + 1 : doc.data().mpd_count
      pdp_count = type.pdp ? doc.data().pdp_count + 1 : doc.data().pdp_count
      trello_count = type.trello ? doc.data().trello_count + 1 : doc.data().trello_count

      transaction.update(docRef, { all_count })
      transaction.update(docRef, { csl_count })
      transaction.update(docRef, { cu3_count })
      transaction.update(docRef, { mpd_count })
      transaction.update(docRef, { pdp_count })
      transaction.update(docRef, { trello_count })

      return console.log('Transaction success')
    })).catch(error => { console.error('Transaction fail:', error) })
  } else if (change.after.exists) {
    // update
    var oldType = change.before.data().type
    var newType = change.after.data().type

    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      csl_count = oldType.csl === newType.csl ? doc.data().csl_count : (!oldType.csl && newType.csl ? doc.data().csl_count + 1 : doc.data().csl_count - 1)
      cu3_count = oldType.cu3 === newType.cu3 ? doc.data().cu3_count : (!oldType.cu3 && newType.cu3 ? doc.data().cu3_count + 1 : doc.data().cu3_count - 1)
      mpd_count = oldType.mpd === newType.mpd ? doc.data().mpd_count : (!oldType.mpd && newType.mpd ? doc.data().mpd_count + 1 : doc.data().mpd_count - 1)
      pdp_count = oldType.pdp === newType.pdp ? doc.data().pdp_count : (!oldType.pdp && newType.pdp ? doc.data().pdp_count + 1 : doc.data().pdp_count - 1)
      trello_count = oldType.trello === newType.trello ? doc.data().trello_count : (!oldType.trello && newType.trello ? doc.data().trello_count + 1 : doc.data().trello_count - 1)

      transaction.update(docRef, { csl_count })
      transaction.update(docRef, { cu3_count })
      transaction.update(docRef, { mpd_count })
      transaction.update(docRef, { pdp_count })
      transaction.update(docRef, { trello_count })

      return console.log('Transaction success')
    })).catch(error => { console.error('Transaction fail:', error) })
  } else {
    // delete
    type = change.before.data().type

    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      all_count = doc.data().all_count - 1
      csl_count = type.csl ? doc.data().csl_count - 1 : doc.data().csl_count
      cu3_count = type.cu3 ? doc.data().cu3_count - 1 : doc.data().cu3_count
      mpd_count = type.mpd ? doc.data().mpd_count - 1 : doc.data().mpd_count
      pdp_count = type.pdp ? doc.data().pdp_count - 1 : doc.data().pdp_count
      trello_count = type.trello ? doc.data().trello_count - 1 : doc.data().trello_count

      transaction.update(docRef, { all_count })
      transaction.update(docRef, { csl_count })
      transaction.update(docRef, { cu3_count })
      transaction.update(docRef, { mpd_count })
      transaction.update(docRef, { pdp_count })
      transaction.update(docRef, { trello_count })

      return console.log('Transaction success')
    })).catch(error => { console.error('Transaction fail:', error) })
  }
})

exports.sendCreateWebTool = functions.firestore.document('tools/web/manipulators/{id}').onCreate((snap, context) => {
  var { title, description, version } = snap.data()
  var [major = 0, minor = 0, patch = 0, pre = ''] = version
  var notif_title = 'Flexiry: New tool added'
  var notif_body = `${title} (v${major}.${minor}.${patch}${pre})\n${description}`

  return database.collection('subscribers').get().then(snapshot => snapshot.forEach(doc => {
    var { token } = doc.data()
    var payload = {
      notification: {
        title: notif_title,
        body: notif_body,
        icon: '/img/icons/android-chrome-192x192.png',
        click_action: '/tools/web'
      },
      data: {
        badge: '/img/icons/android-chrome-192x192.png'
      }
    }

    admin.messaging().sendToDevice(token, payload).then(response => response.results.forEach(result => {
      console.log('Success delivery to', token, result)

      if (result.error) {
        console.error('Failed delivery to', token, result.error)

        // Prepare unused tokens for removal
        if (result.error.code === 'messaging/invalid-registration-token' || result.error.code === 'messaging/registration-token-not-registered') {
          doc.ref.delete()
          console.info('Was removed:', token)
        }
      } else console.info('Notification sent to', token)
    })).catch(error => { console.error('Error sending to', token, error) })
  })).catch(error => { console.error('Error getting subscribers', error) })
})
