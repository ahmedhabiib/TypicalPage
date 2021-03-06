import React, { useState, useEffect, useReducer, useContext } from 'react';

import Card from '../UI/Card/Card';
import classes from './Login.module.css';
import Button from '../UI/Button/Button';
import AuthContext from '../../store/auth-context';

const emailReducer = (state, action) => {
	if (action.type === 'USER_INPUT') {
		return { value: action.val, isValid: action.val.includes('@') };
	}
	if (action.type === 'INPUT_BLUR') {
		return { value: state.value, isValid: state.isValid };
	}
	return { value: '', isValid: false };
};

const passwordReducer = (state, action) => {
	if (action.type === 'USER_INPUT') {
		return { value: action.val, isValid: action.val.trim().length > 6 };
	}
	if (action.type === 'INPUT_BLUR') {
		return { value: state.value, isValid: state.isValid };
	}
	return { value: '', isValid: false };
};

const Login = () => {
	const ctx = useContext(AuthContext);
	const [ formIsValid, setFormIsValid ] = useState(false);

	const [ emailState, emailDispatch ] = useReducer(emailReducer, { value: '', isValid: null });
	const [ passwordState, passwordDispatch ] = useReducer(passwordReducer, { value: '', isValid: null });

	const { isValid: emailValid } = emailState;
	const { isValid: passValid } = passwordState;

	useEffect(
		() => {
			const Timer = setTimeout(() => {
				console.log('Checking Validator');
				setFormIsValid(emailValid && passValid);
			}, 500);

			return () => {
				console.log('Clean Up');
				clearTimeout(Timer);
			};
		},
		[ emailValid, passValid ]
	);

	const emailChangeHandler = (event) => {
		emailDispatch({ type: 'USER_INPUT', val: event.target.value });
	};

	const passwordChangeHandler = (event) => {
		passwordDispatch({ type: 'USER_INPUT', val: event.target.value });
	};

	const validateEmailHandler = () => {
		emailDispatch({ type: 'INPUT_BLUR' });
	};

	const validatePasswordHandler = () => {
		passwordDispatch({ type: 'INPUT_BLUR' });
	};

	const submitHandler = (event) => {
		event.preventDefault();
		ctx.onLogin(emailState.value, passwordState.value);
	};

	return (
		<Card className={classes.login}>
			<form onSubmit={submitHandler}>
				<div className={`${classes.control} ${emailState.isValid === false ? classes.invalid : ''}`}>
					<label htmlFor="email">E-Mail</label>
					<input
						type="email"
						id="email"
						value={emailState.value}
						onChange={emailChangeHandler}
						onBlur={validateEmailHandler}
					/>
				</div>
				<div className={`${classes.control} ${passwordState.isValid === false ? classes.invalid : ''}`}>
					<label htmlFor="password">Password</label>
					<input
						type="password"
						id="password"
						value={passwordState.value}
						onChange={passwordChangeHandler}
						onBlur={validatePasswordHandler}
					/>
				</div>
				<div className={classes.actions}>
					<Button type="submit" className={classes.btn} disabled={!formIsValid}>
						Login
					</Button>
				</div>
			</form>
		</Card>
	);
};

export default Login;
