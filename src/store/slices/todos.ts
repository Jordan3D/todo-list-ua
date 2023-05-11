import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IList } from '../../types';

export interface ITodosState {
	list: number[];
	map: Record<string, IList>;
}

const initialState: ITodosState = {
	list: [],
	map: {},
};

export const todosSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		addNew: (state, action: PayloadAction<Omit<IList, 'id'>>) => {
			const id = state.list.length;
			state.list.push(id);
			state.map[state.list.length] = { ...action.payload, id };
		},
		add: (state, action: PayloadAction<IList>) => {
			const { id } = action.payload;
			if (!state.list[id]) {
				state.list.push(id);
			}
			state.map[action.payload.id] = action.payload;
		},
		edit: (state, action: PayloadAction<IList>) => {
			state.map[action.payload.id] = action.payload;
		},
		remove: (state, action: PayloadAction<IList>) => {
			const index = state.list.findIndex((id: number) => id === action.payload.id);
			state.list = [...state.list.slice(0, index), ...state.list.slice(index + 1)];
			const copy = { ...state.map };
			delete copy[action.payload.id];
			state.map = copy;
		},
	},
});

// Action creators are generated for each case reducer function
export const { addNew, edit, remove } = todosSlice.actions;

export default todosSlice.reducer;
