const admin = require('firebase-admin')
const functions = require('firebase-functions')

admin.initializeApp(functions.config().firebase)

var database = admin.firestore()
database.settings({ timestampsInSnapshots: true })

exports.countBookmarks = functions.firestore.document('tools/bookmarks/manipulators/{id}').onWrite((change, context) => {
  var docRef = database.doc('tools/bookmarks')
  var type, allCount, cslCount, cu3Count, mpdCount, pdpCount, trelloCount

  // check create, update, delete
  if (!change.before.exists) {
    // create
    type = change.after.data().type

    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      allCount = doc.data().allCount + 1
      cslCount = type.csl ? doc.data().cslCount + 1 : doc.data().cslCount
      cu3Count = type.cu3 ? doc.data().cu3Count + 1 : doc.data().cu3Count
      mpdCount = type.mpd ? doc.data().mpdCount + 1 : doc.data().mpdCount
      pdpCount = type.pdp ? doc.data().pdpCount + 1 : doc.data().pdpCount
      trelloCount = type.trello ? doc.data().trelloCount + 1 : doc.data().trelloCount

      transaction.update(docRef, { allCount })
      transaction.update(docRef, { cslCount })
      transaction.update(docRef, { cu3Count })
      transaction.update(docRef, { mpdCount })
      transaction.update(docRef, { pdpCount })
      transaction.update(docRef, { trelloCount })

      return console.log('Transaction success')
    })).catch(error => { console.error('Transaction fail:', error) })
  } else if (change.after.exists) {
    // update
    var oldType = change.before.data().type
    var newType = change.after.data().type

    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      cslCount = oldType.csl === newType.csl ? doc.data().cslCount : (!oldType.csl && newType.csl ? doc.data().cslCount + 1 : doc.data().cslCount - 1)
      cu3Count = oldType.cu3 === newType.cu3 ? doc.data().cu3Count : (!oldType.cu3 && newType.cu3 ? doc.data().cu3Count + 1 : doc.data().cu3Count - 1)
      mpdCount = oldType.mpd === newType.mpd ? doc.data().mpdCount : (!oldType.mpd && newType.mpd ? doc.data().mpdCount + 1 : doc.data().mpdCount - 1)
      pdpCount = oldType.pdp === newType.pdp ? doc.data().pdpCount : (!oldType.pdp && newType.pdp ? doc.data().pdpCount + 1 : doc.data().pdpCount - 1)
      trelloCount = oldType.trello === newType.trello ? doc.data().trelloCount : (!oldType.trello && newType.trello ? doc.data().trelloCount + 1 : doc.data().trelloCount - 1)

      transaction.update(docRef, { cslCount })
      transaction.update(docRef, { cu3Count })
      transaction.update(docRef, { mpdCount })
      transaction.update(docRef, { pdpCount })
      transaction.update(docRef, { trelloCount })

      return console.log('Transaction success')
    })).catch(error => { console.error('Transaction fail:', error) })
  } else {
    // delete
    type = change.before.data().type

    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      allCount = doc.data().allCount - 1
      cslCount = type.csl ? doc.data().cslCount - 1 : doc.data().cslCount
      cu3Count = type.cu3 ? doc.data().cu3Count - 1 : doc.data().cu3Count
      mpdCount = type.mpd ? doc.data().mpdCount - 1 : doc.data().mpdCount
      pdpCount = type.pdp ? doc.data().pdpCount - 1 : doc.data().pdpCount
      trelloCount = type.trello ? doc.data().trelloCount - 1 : doc.data().trelloCount

      transaction.update(docRef, { allCount })
      transaction.update(docRef, { cslCount })
      transaction.update(docRef, { cu3Count })
      transaction.update(docRef, { mpdCount })
      transaction.update(docRef, { pdpCount })
      transaction.update(docRef, { trelloCount })

      return console.log('Transaction success')
    })).catch(error => { console.error('Transaction fail:', error) })
  }
})

exports.sendCreateBookmark = functions.firestore.document('tools/bookmarks/manipulators/{id}').onCreate((snap, context) => {
  var { title, description, version } = snap.data()
  var [major = 0, minor = 0, patch = 0, pre = ''] = version
  var notif_title = 'New bookmark added'
  var notif_body = `${title} (v${major}.${minor}.${patch}${pre})\n${description}`

  return database.collection('subscribers').get().then(snapshot => snapshot.forEach(doc => {
    var { token } = doc.data()
    var payload = {
      notification: {
        title: notif_title,
        body: notif_body,
        icon: '/img/icons/android-chrome-192x192.png',
        click_action: '/bookmarks'
      },
      data: {
        badge: '/img/icons/android-chrome-192x192.png'
      }
    }

    _sendToDevice(token, payload, doc)

  })).catch(error => { console.error('Error getting subscribers', error) })
})

function _sendToDevice (token, payload, doc) {
  admin.messaging().sendToDevice(token, payload).then(response => response.results.forEach(result => {
    console.log('Success delivery to', token, result)

    if (result.error) {
      console.error('Failed delivery to', token, result.error)

      if (result.error.code === 'messaging/invalid-registration-token' || result.error.code === 'messaging/registration-token-not-registered') {
        doc.ref.delete()
        console.info('Was removed:', token)
      }
    } else console.info('Notification sent to', token)
  })).catch(error => { console.error('Error sending to', token, error) })
}
