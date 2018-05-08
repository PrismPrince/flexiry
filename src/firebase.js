// firebase initalization
import config from '../firebase-config.json'
import Firebase from 'firebase'

Firebase.initializeApp(config)

export default Firebase
