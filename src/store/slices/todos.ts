import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { IFilter, IList } from '../../types';
import FetchData from '../../utils/storage';
import { RootState } from '..';

export interface ITodosState {
	list: string[];
	map: Record<string, IList>;
}

const initialState: ITodosState = {
	list: [],
	map: {},
};

// First, create the thunk
export const fetchAllTodosByFilter = createAsyncThunk(
	'todos/fetchAllTodosByFilter',
	async (filters: IFilter, thunkAPI) => {
		const { todos } = thunkAPI.getState() as RootState;
		// filters.lastId = todos.list[todos.list.length - 1];
		const response = await FetchData.getLists(filters);
		return response;
	}
);

export const removeTodoById = createAsyncThunk(
	'todos/removeTodoById',
	async (id: string, thunkAPI) => FetchData.removeTodo(id)
);

export const todosSlice = createSlice({
	name: 'todos',
	initialState,
	reducers: {
		add: (state, action: PayloadAction<IList>) => {
			const { id } = action.payload;
			const index = state.list.findIndex((lid: string) => lid === action.payload.id);
			if (index === -1) {
				state.list.push(id);
			}
			state.map[action.payload.id] = action.payload;
		},
		edit: (state, action: PayloadAction<IList>) => {
			state.map[action.payload.id] = action.payload;
		},
		remove: (state, action: PayloadAction<IList>) => {
			const index = state.list.findIndex((id: string) => id === action.payload.id);
			state.list = [...state.list.slice(0, index), ...state.list.slice(index + 1)];
			const copy = { ...state.map };
			delete copy[action.payload.id];
			state.map = copy;
		},
	},
	extraReducers: (builder) => {
		// Add reducers for additional action types here, and handle loading state as needed
		builder.addCase(fetchAllTodosByFilter.fulfilled, (state, action) => {
			state.list = action.payload.map((item) => item.id);
			action.payload.forEach((item) => {
				state.map[item.id] = item;
			});
		});
	},
});

// Action creators are generated for each case reducer function
export const { add, edit, remove } = todosSlice.actions;

export default todosSlice.reducer;
