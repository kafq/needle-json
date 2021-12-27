import * as React from "react"
import "./Button.style.css"

interface ButtonProps {
	text?: string
	isFileType?: boolean
	onClick?(event: React.MouseEvent<HTMLButtonElement>): void
	onChange?(event: React.FormEvent<HTMLInputElement>): void
	type?: "DEFAULT" | "SELECTED"
}

const Button: React.FC<ButtonProps> = props => {
	const getButtonStyle = (type: "DEFAULT" | "SELECTED") => {
		switch (type) {
			case "DEFAULT":
				return "default"
			case "SELECTED":
				return "selected"
		}
	}
	const button = () => (
		<button
			className={`button ${props.type && getButtonStyle(props.type)}`}
			onClick={props.onClick}
			onChange={props.onChange}
		>
			{props.text}
		</button>
	)
	const fileButton = () => (
		<input
			type="file"
			accept="application/json"
			onClick={props.onClick}
			onChange={props.onChange}
		/>
	)

	return props.isFileType ? fileButton() : button()
}

export { Button }
