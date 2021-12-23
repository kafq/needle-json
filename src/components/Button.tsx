import * as React from 'react'

interface ButtonProps {
    title?: string
    isFileType?: boolean
    onClick?(event: React.MouseEvent<HTMLButtonElement>): void
    onChange?(event: React.FormEvent<HTMLInputElement>): void
}

const Button: React.FC<ButtonProps> = props => {
    const button = () => (
        <button onClick={props.onClick} onChange={props.onChange} title={props.title}>I am a button called {props.title}</button>
    )
    const fileButton = () => (
        <input type="file" accept="application/json" onClick={props.onClick} onChange={props.onChange} />
    )

    return props.isFileType ? fileButton() : button()
}

export { Button }