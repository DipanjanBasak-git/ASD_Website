import React from 'react';
import styles from './Input.module.css';
import classNames from 'classnames';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export default function Input({ label, error, className, ...props }: InputProps) {
    return (
        <div className={styles.inputWrapper}>
            {label && <label className={styles.label} htmlFor={props.id || props.name}>{label}</label>}
            <input
                className={classNames(styles.input, className, { [styles.hasError]: !!error })}
                {...props}
            />
            {error && <span className={styles.error}>{error}</span>}
        </div>
    );
}
