import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface IState {
	count: number;
	map: Record<string, string>;
	lastId?: string;
	autoSearch: boolean;
}

const initialState: IState = {
	count: 20,
	map: {},
	lastId: undefined,
	autoSearch: false,
};

export const filtersSlice = createSlice({
	name: 'filters',
	initialState,
	reducers: {
		set: (state, action: PayloadAction<Partial<IState>>) => {
			Object.keys(action.payload).forEach((key) => {
				if (key === 'count') {
					state[key] = action.payload[key] as number;
				} else if (key === 'map') {
					state[key] = { ...state[key], ...action.payload[key] } as Record<string, string>;
				} else if (key === 'lastId') {
					state[key] = action.payload[key] as string;
				} else if (key === 'autoSearch') {
					state[key] = action.payload[key] as boolean;
				}
			});
		},
	},
});

// Action creators are generated for each case reducer function
export const { set } = filtersSlice.actions;

export default filtersSlice.reducer;
