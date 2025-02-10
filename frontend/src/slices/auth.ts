// eslint-disable-next-line
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
// eslint-disable-next-line

const initialState = {} as AuthState

const authSlice = createSlice({
	name: 'auth',
	initialState: initialState,
	reducers: {
		login(
			_state,
			action: PayloadAction<{ user: User; accessToken: string; refreshToken: string }>
		) {
			return {
				user: action.payload.user,
				accessToken: action.payload.accessToken,
				refreshToken: action.payload.refreshToken
			}
		},
		logOut() {
			return initialState
		}
	}
})

const { reducer } = authSlice

export const { login, logOut } = authSlice.actions

export default reducer
