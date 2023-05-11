export interface IList {
	title: string;
	id: number;
}

export interface IListItem {
	text: string;
	id: number;
}

export interface IGetList extends IList {
	todos: ReadonlyArray<IListItem>;
}
