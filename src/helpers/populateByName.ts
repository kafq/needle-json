import { getKeyType } from "./getKeyType"

const DELIMITER = ", "

const changeFrameName = (selectedLayers, JSONobj) => {
	let itemIndex = 0
	const loopSelected = arr => {
		arr.map(figNode => {
			if (
				figNode.parent.type === "PAGE" &&
				JSONobj[itemIndex]?.hasOwnProperty("_frameName")
			) {
				figNode.name = JSONobj[itemIndex]._frameName
				++itemIndex
			}
		})
	}
	loopSelected(selectedLayers)
}

const populateByName = (
	selectedLayers: readonly SceneNode[],
	JSONobj,
	selectedItem: string
) => {
	let itemIndex = 0
	const keyType = getKeyType(selectedItem, JSONobj)
	const loopSelected = (arr: readonly SceneNode[]) => {
		arr.map((figNode: any) => {
			const JSONItemVal = JSONobj[itemIndex]?.[selectedItem]

			switch (keyType) {
				case "BOOLEAN": {
					if (figNode.name.toUpperCase() === selectedItem.toUpperCase()) {
						figNode.visible = JSONobj[itemIndex]?.[selectedItem] ? true : false
						++itemIndex
					}
					break
				}
				case "TEXT":
					if (
						figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
						figNode.type === "TEXT" &&
						(JSONItemVal || JSONItemVal === "" || JSONItemVal === null)
					) {
						figma.loadFontAsync(figNode.fontName).then(() => {
							figNode.characters = JSONobj[itemIndex]?.[selectedItem].toString()
							++itemIndex
						})
					}
					break
				case "VARIANT": {
					if (
						figNode.name.toUpperCase() === selectedItem.toUpperCase() &&
						(JSONItemVal?.toString().split("-")[0] === "VARIANT" ||
							JSONItemVal === "") &&
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
						++itemIndex
					}
					break
				}
				case "NONE":
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
