import { IFetchData, IFilter, IListEntity, IListItem } from '../types';

const getTodo = (id: string) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	const result = data[id];

	return Promise.resolve(result);
};

const getLists = async (filters: IFilter) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	const result = Object.keys(data)
		.map((id) => data[id])
		// @ts-ignore
		.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));

	return Promise.resolve(result);
};

const createTodo = async (title: string, todos: ReadonlyArray<IListItem>) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	const result = {
		id: Object.keys(data).length,
		createDate: new Date(),
		title,
		todos,
	} as IListEntity;
	data[result.id] = result;
	localStorage.setItem('todosData', JSON.stringify(data));

	return Promise.resolve(result);
};

const editTodo = async (
	id: string,
	editData: { title?: string; todos?: ReadonlyArray<IListItem> }
) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	let result = data[id];

	if (result) {
		result = { ...result, ...editData };
		data[result.id] = result;
		localStorage.setItem('todosData', JSON.stringify(data));
	}
	return Promise.resolve(result);
};

const removeTodo = async (id: string) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	const item = data[id];

	if (item) {
		delete data[id];
		localStorage.setItem('todosData', JSON.stringify(data));
	}

	return Promise.resolve(!!item);
};

const FetchData: IFetchData = {
	getTodo,
	getLists,
	createTodo,
	editTodo,
	removeTodo,
};

export default FetchData;
