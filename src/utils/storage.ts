import { nanoid } from '@reduxjs/toolkit';
import { IFetchData, IFilter, IListEntity, IListItem } from '../types';

const getAll = () => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;

	return Promise.resolve(data);
};

const setData = (data: Record<string, IListEntity>) => {
	try {
		localStorage.setItem('todosData', JSON.stringify(data));
	} catch (err) {
		console.error('Something wrong with seting data');
	}

	return Promise.resolve(true);
};

const getTodo = (id: string) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	const result = data[id] || null;

	return Promise.resolve(result);
};

const getLists = async ({ count, filters, lastId }: IFilter) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	let result = Object.keys(data)
		.map((id) => data[id])
		.filter((item) => item.title.indexOf(filters?.search || '') >= 0)
		// @ts-ignore
		.sort((a, b) => new Date(b.createDate) - new Date(a.createDate));
	const lastIdIndex = result.findIndex((item) => item.id === lastId);
	if (lastIdIndex === -1) {
		result = result.slice(0, count);
	} else {
		result = result.slice(lastIdIndex, lastIdIndex + count);
	}

	return Promise.resolve(result);
};

const createTodo = async (title: string, todos: ReadonlyArray<IListItem>) => {
	const data = JSON.parse(localStorage.getItem('todosData') || '{}') as Record<string, IListEntity>;
	const result = {
		id: nanoid(),
		createDate: new Date().toISOString(),
		title,
		todos: todos.map((item) => {
			// Replacing temporary id
			item.id = nanoid();
			return item;
		}),
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
	getAll,
	setData,
	getTodo,
	getLists,
	createTodo,
	editTodo,
	removeTodo,
};

export default FetchData;
