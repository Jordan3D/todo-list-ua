import { RootState } from '..';
import { IList } from '../../types';

export const selectTodos = (state: RootState): ReadonlyArray<IList> =>
	state.todos.list.map((id) => state.todos.map[id]);

export const selectTodo =
	(state: RootState) =>
	(id: number | undefined): IList | undefined =>
		id ? state.todos.map[id] : undefined;
