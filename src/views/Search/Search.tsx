import { ReactElement, useState } from 'react';
import { List, ListItemButton, OutlinedInput, Button, Typography } from '@mui/material';
import { useSearchParams, useLocation } from 'react-router-dom';
import './Search.css';
import TodoList from '../../components/TodoList/TodoList';

interface ISearchQuery {
	id?: string;
	title?: string;
	autosearch?: string;
}

const useGetSearchParams = () => {
	const useQuery = () => new URLSearchParams(useLocation().search);
	const query = useQuery();
	const map = {} as ISearchQuery;

	for (const [key, value] of query.entries() as IterableIterator<[keyof ISearchQuery, string]>) {
		// eslint-disable-next-line
		map[key] = value;
	}

	return map;
};

const Search = (): ReactElement => {
	const [searchParams, setSearchParams] = useSearchParams();
	const { id, title } = useGetSearchParams();
	const [showAll, setShowAll] = useState(false);

	const onClose = () => {
		searchParams.set('id', '');
		setSearchParams(searchParams);
	};

	const onSubmit = () => {
		// TODO Get all filters in Inputs, set them to url
	};

	const onShowAllFilters = () => {
		setShowAll((value) => !value);
	};

	return (
		<div className="SearchContainer">
			<div className="SearchSection">
				<div className="SearchHeader">
					<div className="SearchHeader__mainFilters">
						<div className="SearchHeaderGroup">
							<OutlinedInput className="SearchByTitle" defaultValue={title}></OutlinedInput>
							<Button className="SearchButton" onClick={onShowAllFilters}>
								{showAll ? <Typography>Hide</Typography> : <Typography>Show</Typography>}
							</Button>
						</div>
						<div className="SearchByOther"></div>
						<Button className="SearchButton" onClick={onSubmit}>
							<Typography>Search</Typography>
						</Button>
					</div>
					{showAll && <div className="SearchHeader__restFilters"></div>}
				</div>
				<div className="SearchResult"></div>
			</div>
			{id && (
				<div className="SearchSection">
					<TodoList id={id} onClose={onClose} />
				</div>
			)}
		</div>
	);
};

export default Search;
