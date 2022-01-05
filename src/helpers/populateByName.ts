const DELIMITER = ", "

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
	console.log(selectedItem)
	const loopSelected = arr => {
		arr.map(figNode => {
			const JSONItemVal = JSONobj[keyCount]?.[selectedItem]
			// If the node is text, just change its contents
			if (
				figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
				figNode.type === "TEXT" &&
				selectedItem !== "_frameName" &&
				typeof JSONobj[keyCount] !== "undefined" &&
				JSONobj[keyCount][selectedItem]
			) {
				// JSON value did not contain any specific parameters
				// Simply change layer's contents
				figma.loadFontAsync(figNode.fontName).then(() => {
					figNode.characters = JSONobj[keyCount]?.[selectedItem].toString()
					keyCount = ++keyCount
				})
			}

			if (
				figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
				typeof JSONItemVal === "boolean"
			) {
				figNode.visible = JSONobj[keyCount]?.[selectedItem] ? true : false
				keyCount = ++keyCount
			}

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
				keyCount++
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
