import cx from 'classnames'
import React, { PureComponent } from 'react'
import slugify from 'slugify'
import { ReactComponent as SearchIcon } from '../../../img/search.svg'
import Help from './Help'
import styles from './Input.module.scss'
import Label from './Label'
import Row from './Row'
import InputGroup from './InputGroup'

export default class Input extends PureComponent {
    state = { isFocused: false }

    inputWrapClasses() {
        if (this.props.type === 'search') {
            return styles.inputWrapSearch
        } else if (this.props.type === 'search' && this.state.isFocused) {
            return cx(styles.inputWrapSearch, styles.isFocused)
        } else if (this.state.isFocused && this.props.type !== 'search') {
            return cx(styles.inputWrap, styles.isFocused)
        } else {
            return styles.inputWrap
        }
    }

    toggleFocus = () => {
        this.setState({ isFocused: !this.state.isFocused })
    }

    InputComponent = () => {
        const { type, options, group, name, required, onChange } = this.props

        const wrapClass = this.inputWrapClasses()

        if (type === 'select') {
            return (
                <div className={wrapClass}>
                    <select
                        id={name}
                        className={styles.select}
                        name={name}
                        required={required}
                        onFocus={this.toggleFocus}
                        onBlur={this.toggleFocus}
                        onChange={onChange}
                    >
                        <option value="">---</option>
                        {options &&
                            options.map((option, index) => (
                                <option
                                    key={index}
                                    value={slugify(option, {
                                        lower: true
                                    })}
                                >
                                    {option}
                                </option>
                            ))}
                    </select>
                </div>
            )
        } else if (type === 'textarea') {
            return (
                <div className={wrapClass}>
                    <textarea
                        id={name}
                        className={styles.input}
                        onFocus={this.toggleFocus}
                        onBlur={this.toggleFocus}
                        {...this.props}
                    />
                </div>
            )
        } else if (type === 'radio' || type === 'checkbox') {
            return (
                <div className={styles.radioGroup}>
                    {options &&
                        options.map((option, index) => (
                            <div className={styles.radioWrap} key={index}>
                                <input
                                    className={styles.radio}
                                    id={slugify(option, {
                                        lower: true
                                    })}
                                    type={type}
                                    name={name}
                                    value={slugify(option, {
                                        lower: true
                                    })}
                                />
                                <label
                                    className={styles.radioLabel}
                                    htmlFor={slugify(option, {
                                        lower: true
                                    })}
                                >
                                    {option}
                                </label>
                            </div>
                        ))}
                </div>
            )
        }

        return (
            <div className={wrapClass}>
                {group ? (
                    <InputGroup>
                        <input
                            id={name}
                            className={styles.input}
                            onFocus={this.toggleFocus}
                            onBlur={this.toggleFocus}
                            {...this.props}
                        />
                        {group}
                    </InputGroup>
                ) : (
                    <input
                        id={name}
                        className={styles.input}
                        onFocus={this.toggleFocus}
                        onBlur={this.toggleFocus}
                        {...this.props}
                    />
                )}

                {type === 'search' && <SearchIcon />}
            </div>
        )
    }

    render() {
        const {
            name,
            label,
            required,
            help,
            additionalComponent,
            multiple
        } = this.props

        return (
            <Row>
                <Label htmlFor={name} required={required}>
                    {label}
                </Label>

                <this.InputComponent />

                {help && <Help>{help}</Help>}

                {multiple && 'hello'}

                {additionalComponent && additionalComponent}
            </Row>
        )
    }
}
