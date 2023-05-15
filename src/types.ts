export interface IList {
	title: string;
	id: string;
}

export interface IListItem {
	text: string;
	id: string;
}

export interface IListEntity extends IList {
	todos: ReadonlyArray<IListItem>;
	createDate: string;
}

export interface IFilter {
	count: number;
	filters?: Record<string, string>;
	lastId?: string;
}

export interface ISearchQuery {
	id?: string;
	title?: string;
	autosearch?: string;
	sort: string;
	order: string;
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
