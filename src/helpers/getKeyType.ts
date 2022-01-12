type KEY_TYPE = "BOOLEAN" | "TEXT" | "VARIANT" | "FRAME_NAME" | "NONE"

const getKeyType = (key: string, collection: any): KEY_TYPE => {
	let keyType: KEY_TYPE = "NONE"
	collection.map(i => {
		if (i[key] === true) {
			keyType = "BOOLEAN"
			return
		}

		if (typeof i[key] === "string" && i[key] !== "" && !key.startsWith("_")) {
			keyType = "TEXT"
		}

		if (key.startsWith("_")) {
			keyType = "FRAME_NAME"
			return
		}

		if (i[key]) {
			if (i[key].startsWith("VARIANT")) {
				keyType = "VARIANT"
			}
			return
		}
	})
	return keyType
}

export { getKeyType }
