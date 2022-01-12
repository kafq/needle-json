// Gathers all keys used in the whole JSON array

const getCollectionKeys = arr => {
	const keys = []
	arr.map(i => {
		Object.keys(i).map(k => {
			if (!keys.includes(k)) {
				keys.push(k)
			}
		})
	})
	return keys
}

export { getCollectionKeys }
