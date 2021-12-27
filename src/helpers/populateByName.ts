const populateByName = (selectedLayers, JSONobj, selectedItem) => {
	let newItem = 0

	const loopSelected = arr => {
		arr.map(item => {
			if (
				item.name.toUpperCase() === selectedItem.toUpperCase() &&
				item.type === "TEXT"
			) {
				figma.loadFontAsync(item.fontName).then(() => {
					if (typeof JSONobj[newItem] !== "undefined") {
						item.characters = JSONobj[newItem]?.[selectedItem]?.toString()
						newItem = ++newItem
					}
				})
			}

			if (
				item.name.toUpperCase() === selectedItem.toUpperCase() &&
				item.type !== "TEXT"
			) {
				item.visible = JSONobj[newItem]?.[selectedItem] ? true : false
				newItem = ++newItem
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
