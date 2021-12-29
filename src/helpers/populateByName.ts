const delimiter = ", "

const populateByName = (selectedLayers, JSONobj, selectedItem) => {
	let layerCount = 0

	const loopSelected = arr => {
		arr.map(item => {
			const JSONItemVal = JSONobj[layerCount]?.[selectedItem]
			if (
				item.name.toUpperCase() === selectedItem.toUpperCase() &&
				item.type === "TEXT" &&
				JSONItemVal?.toString().split("-")[0] !== "VARIANT"
			) {
				figma.loadFontAsync(item.fontName).then(() => {
					if (typeof JSONobj[layerCount] !== "undefined") {
						item.characters = JSONItemVal.toString()
						layerCount = ++layerCount
					}
				})
			}

			if (
				item.name.toUpperCase() === selectedItem.toUpperCase() &&
				item.type !== "TEXT" &&
				typeof JSONItemVal === "boolean"
			) {
				item.visible = JSONobj[layerCount]?.[selectedItem] ? true : false
				layerCount = ++layerCount
			}

			if (
				item.name.toUpperCase() === selectedItem.toUpperCase() &&
				item.mainComponent?.parent?.type === "COMPONENT_SET" &&
				JSONItemVal?.toString().split("-")[0] === "VARIANT"
			) {
				let propertyIndex = -1
				const propertyName = JSONItemVal.split("-")[1]
				const nodeProperties = item.mainComponent.name.split("-")
				propertyIndex = nodeProperties.findIndex(i =>
					i.startsWith(`${propertyName}=`)
				)
				const propertyValue = JSONItemVal.split("-")[2]

				if (propertyIndex !== -1) {
					nodeProperties[propertyIndex] = `${propertyName}=${propertyValue}`
					const newVariantName = nodeProperties.join("")
					const newVariant = item.mainComponent.parent.findChild(
						i => i.name === newVariantName
					)
					if (newVariant) {
						console.log("Attempting swap")
						item.swapComponent(newVariant)
						layerCount = ++layerCount
					}
				}
			}

			if (item.children) {
				loopSelected(item.children)
			}
			return
		})
	}
	loopSelected(selectedLayers)
}

export { populateByName }
