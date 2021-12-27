import * as React from "react"
import { useEffect, useState } from "react"
import { Button } from "./Button"
import { getCollectionKeys } from "../helpers/getCollectionKeys"
import "./PropertiesControl.css"

interface Props {
	obj: { [key: string]: string | boolean }
	onSubmit: (keys) => void
}

interface Key {
	[key: string]: boolean
}

const PropertiesControl: React.FC<Props> = props => {
	const [selectedKeys, setSelectedKeys] = useState<Key[]>([])
	useEffect(() => {
		if (props.obj) {
			setSelectedKeys(
				getCollectionKeys(props.obj).reduce(
					(acc, curr) => ((acc[curr] = false), acc),
					{}
				)
			)
		}
	}, [props.obj])

	const renderButtons = () => {
		return Object.keys(props.obj[0]).map(i => {
			const handleToggle = () => {
				setSelectedKeys(prevState => ({
					...prevState,
					[i]: !prevState[i],
				}))
			}

			return (
				<Button
					type={selectedKeys[i] ? "SELECTED" : "DEFAULT"}
					onClick={handleToggle}
					text={i}
				/>
			)
		})
	}

	return (
		<>
			<div className="properties">{renderButtons()}</div>
			<Button
				className="btn-primary"
				onClick={() => props.onSubmit(selectedKeys)}
				text="Populate"
			/>
		</>
	)
}

export { PropertiesControl }
