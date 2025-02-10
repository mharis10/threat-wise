import localForage from 'localforage'

const db = localForage.createInstance({
	driver: localForage.INDEXEDDB,
	name: 'phishing-defender-db',
	storeName: 'phishing-defender',
	size: 5 * 1024 * 1024, // 5.24 MBs
	description: 'Phishing Defender DB'
})

export const indexedStorageDB = {
	db,
	getItem: db.getItem,
	setItem: db.setItem,
	removeItem: db.removeItem,
	clear: db.clear
}
