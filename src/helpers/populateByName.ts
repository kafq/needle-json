const DELIMITER = ", "
type KEY_TYPE = "BOOLEAN" | "TEXT" | "VARIANT" | "FRAME_NAME" | "NONE"

const getKeyType = (key: string, collection: any): KEY_TYPE => {
	let keyType: KEY_TYPE = "NONE"
	collection.map(i => {
		if (i[key] === true) {
			keyType = "BOOLEAN"
			return
		}

		if (typeof i[key] === "string" && !key.startsWith("_")) {
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

const changeFrameName = (selectedLayers, JSONobj) => {
	let keyCount = 0
	const loopSelected = arr => {
		arr.map(figNode => {
			if (
				figNode.parent.type === "PAGE" &&
				JSONobj[keyCount]?.hasOwnProperty("_frameName")
			) {
				figNode.name = JSONobj[keyCount]._frameName
				keyCount++
			}
		})
	}
	loopSelected(selectedLayers)
}

const populateByName = (selectedLayers, JSONobj, selectedItem) => {
	let keyCount = 0
	const keyType = getKeyType(selectedItem, JSONobj)

	const loopSelected = arr => {
		arr.map(figNode => {
			const JSONItemVal = JSONobj[keyCount]?.[selectedItem]

			switch (keyType) {
				case "BOOLEAN": {
					if (figNode.name.toUpperCase() === selectedItem.toUpperCase()) {
						figNode.visible = JSONobj[keyCount]?.[selectedItem] ? true : false
						keyCount = ++keyCount
					}
					break
				}
				case "TEXT":
					if (
						figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
						figNode.type === "TEXT" &&
						JSONobj[keyCount][selectedItem]
					) {
						figma.loadFontAsync(figNode.fontName).then(() => {
							figNode.characters = JSONobj[keyCount]?.[selectedItem].toString()
							keyCount = ++keyCount
						})
					}
					break
				case "VARIANT": {
					if (
						figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
						JSONItemVal?.toString().split("-")[0] === "VARIANT" &&
						figNode.mainComponent?.parent?.type === "COMPONENT_SET"
					) {
						// Parent contains variants
						// Figma variant component names is composed as:
						// Property_1=Value 1, Property_2=Value 2
						// using ", " is a delimiter
						let propertyIndex = -1
						const propertyName = JSONItemVal.split("-")[1]
						const nodeProperties = figNode.mainComponent.name.split(DELIMITER)
						// check if variant contains required property
						propertyIndex = nodeProperties.findIndex(i =>
							i.startsWith(`${propertyName}=`)
						)
						const newValue = JSONItemVal.split("-")[2]
						if (propertyIndex !== -1) {
							// replace old property with new one
							nodeProperties[propertyIndex] = `${propertyName}=${newValue}`
							const newNodeName = nodeProperties.join(DELIMITER)
							const newVariant = figNode.mainComponent.parent.findChild(
								i => i.name === newNodeName
							)
							if (newVariant) {
								figNode.swapComponent(newVariant)
							}
						}
						keyCount = ++keyCount
					}
					break
				}
				case "NONE":
					console.log("NONE!")
					break
				default:
					return
			}

			if (figNode.children) {
				loopSelected(figNode.children)
			}
			return
		})
	}
	loopSelected(selectedLayers)
}

export { changeFrameName, populateByName }
