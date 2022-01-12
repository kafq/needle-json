type FilteredObject = {
	[key: string]: string | boolean
}

/**
 * Filling keys is required to allow iteration through the keys, even though some of the values
 * were not specified. It is useful when creating JSON object manually, since
 * empty paramateres don't have to be mentioned
 * If the workflow involves Excel to .csv conversation unused values will be filled with
 * empty string or null anyway
 */

const fillInEmptyKeys = (json, keys: string[]): FilteredObject[] => {
	const filled = json
	json.map((i, index) => {
		keys.map(k => {
			if (i[k] === undefined) {
				filled[index][k] = ""
			}
		})
	})
	return filled
}

export { fillInEmptyKeys }
