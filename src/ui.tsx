import * as React from "react"
import { useState } from "react"
import * as ReactDOM from "react-dom"

import { Button } from "./components/Button"
import { PropertiesControl } from "./components/PropertiesControl"
import "./ui.css"

const App = () => {
	const [JSONobj, setJSONobj] = useState(null)

	const handleChangeButton = e => {
		let fileReader = new FileReader()
		fileReader.readAsText(e.target.files[0])

		fileReader.onload = () => {
			try {
				let obj = JSON.parse(fileReader.result as string)
				setJSONobj(obj)
			} catch (error) {
				console.error(
					error,
					"Something wrong with the file. Check the structure"
				)
			}
		}
		e.target.value = ""
	}

	const handlePopulate = selected => {
		const getSelectedItems = obj => {
			const selected = []
			Object.keys(obj).map(i => {
				if (obj[i]) {
					selected.push(i)
				}
			})
			return selected
		}

		parent.postMessage(
			{
				pluginMessage: {
					type: "populate",
					selected: getSelectedItems(selected),
					obj: JSONobj,
				},
			},
			"*"
		)
	}
	return (
		<main className="container">
			<h2>Soup X JSON</h2>
			{JSONobj ? (
				<PropertiesControl obj={JSONobj} onSubmit={handlePopulate} />
			) : (
				<div>No object provided</div>
			)}
			<Button isFileType onChange={handleChangeButton} onClick={() => {}} />
		</main>
	)
}

ReactDOM.render(<App />, document.getElementById("react-page"))
