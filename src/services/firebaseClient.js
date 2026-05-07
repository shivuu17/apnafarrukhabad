import { initializeApp, getApp, getApps } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import firebaseConfig from './firebaseConfig'

let appInstance = null

function assertFirebaseConfig() {
	const required = ['apiKey', 'authDomain', 'projectId', 'appId']
	const missing = required.filter((key) => !String(firebaseConfig[key] || '').trim())

	if (missing.length) {
		throw new Error(`Firebase configuration is missing: ${missing.join(', ')}. Set VITE_FIREBASE_* values in .env and restart the dev server.`)
	}
}

export function getFirebaseApp() {
	if (appInstance) return appInstance
	assertFirebaseConfig()
	appInstance = getApps().length ? getApp() : initializeApp(firebaseConfig)
	return appInstance
}

export function getFirebaseAuth() {
	return getAuth(getFirebaseApp())
}

export function getFirebaseDb() {
	return getFirestore(getFirebaseApp())
}

export default getFirebaseApp
