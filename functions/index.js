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

      console.log('Transaction success')

      return null
    })).catch(error => { console.error('Transaction fail:', error) })
  } else if (change.after.exists) {
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

      console.log('Transaction success')

      return null
    })).catch(error => { console.error('Transaction fail:', error) })
  } else {
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

      console.log('Transaction success')

      return null
    })).catch(error => { console.error('Transaction fail:', error) })
  }
})

exports.countFontSwaps = functions.firestore.document('tools/font-swaps/fonts/{id}').onWrite((change, context) => {
  var docRef = database.doc('tools/font-swaps')

  if (!change.before.exists)
    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      return transaction.update(docRef, { fontCount: doc.data().fontCount + 1 })
    })).catch(error => { console.error('Transaction fail:', error) })
  else if (change.before.exists && !change.after.exists)
    return database.runTransaction(transaction => transaction.get(docRef).then(doc => {
      return transaction.update(docRef, { fontCount: doc.data().fontCount - 1 })
    })).catch(error => { console.error('Transaction fail:', error) })
  else
    return null
})

exports.notifyCreateBookmark = functions.firestore.document('tools/bookmarks/manipulators/{id}').onCreate((snap, context) => {
  var { title, description, version } = snap.data()
  var [major = 0, minor = 0, patch = 0, pre = ''] = version
  var notif_title = 'A bookmark is added'
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

exports.notifyUpdateBookmark = functions.firestore.document('tools/bookmarks/manipulators/{id}').onUpdate((change, context) => {
  var { title } = change.after.data()
  var [old_major = 0, old_minor = 0, old_patch = 0, old_pre = ''] = change.before.data().version
  var [new_major = 0, new_minor = 0, new_patch = 0, new_pre = ''] = change.after.data().version
  var old_version = `${old_major}.${old_minor}.${old_patch}${old_pre}`
  var new_version = `${new_major}.${new_minor}.${new_patch}${new_pre}`
  var notif_title = 'A bookmark is updated'
  var notif_body = `${title} has new version update from v${old_version} to v${new_version}.\nCheck it out!`

  if (old_version === new_version) {
    console.log('Update version is the same. No notification sent.')

    return null
  } else return database.collection('subscribers').get().then(snapshot => snapshot.forEach(doc => {
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
