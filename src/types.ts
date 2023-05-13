export interface IList {
	title: string;
	id: number;
}

export interface IListItem {
	text: string;
	id: number;
}

export interface IListEntity extends IList {
	todos: ReadonlyArray<IListItem>;
	createDate: Date;
}

export interface IFilter {
	count?: number;
	filters?: Record<string, string>;
	sortBy?: [string, 'DESC' | 'ASC'];
	lastId?: number;
}

export interface IFetchData {
	getTodo(id: string): Promise<IListEntity | null>;
	getLists(filters: IFilter): Promise<ReadonlyArray<IListEntity>>;
	createTodo(title: string, todos: ReadonlyArray<IListItem>): Promise<IListEntity | null>;
	editTodo(
		id: string,
		data: { title?: string; todos?: ReadonlyArray<IListItem> }
	): Promise<IListEntity | null>;
	removeTodo(id: string): Promise<boolean>;
}
