const DELIMITER = ", "

const populateByName = (selectedLayers, JSONobj, selectedItem) => {
	let layerCount = 0

	const loopSelected = arr => {
		arr.map(figNode => {
			const JSONItemVal = JSONobj[layerCount]?.[selectedItem]

			// If the node is text, just change its contents
			if (
				figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
				figNode.type === "TEXT"
			) {
				// JSON value did not contain any specific parameters
				// Simply change layer's contents
				figma.loadFontAsync(figNode.fontName).then(() => {
					if (typeof JSONobj[layerCount] !== "undefined") {
						figNode.characters = JSONItemVal.toString()
						layerCount = ++layerCount
					}
				})
			}

			if (
				figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
				typeof JSONItemVal === "boolean"
			) {
				figNode.visible = JSONobj[layerCount]?.[selectedItem] ? true : false
				layerCount = ++layerCount
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
						layerCount = ++layerCount
					}
				}
			}

			if (figNode.children) {
				loopSelected(figNode.children)
			}
			return
		})
	}
	loopSelected(selectedLayers)
}

export { populateByName }
