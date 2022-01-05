import { changeFrameName, populateByName } from "./helpers/populateByName"

figma.showUI(__html__, {
	width: 400,
	height: 700,
})

figma.ui.onmessage = msg => {
	const isSelectionLength = figma.currentPage.selection.length !== 0

	if (msg.type === "populate") {
		// Check if something selected

		let selectedArray = msg.selected
		const selection = figma.currentPage.selection
		const obj = msg.obj

		// POPULATE
		if (!isSelectionLength) {
			figma.notify(`Select frames/groups to populate matches`, {
				timeout: 3000,
				error: true,
			})
		} else {
			if (selectedArray.length > 0) {
				selectedArray.map(selectedItem => {
					if (selectedItem === "_frameName") {
						changeFrameName(selection, obj)
					}
					populateByName(selection, obj, selectedItem)
				})
			} else {
				figma.notify(`Select keys to populate`, { timeout: 3000, error: true })
			}
		}
	}
}
