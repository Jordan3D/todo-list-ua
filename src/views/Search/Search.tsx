import { ReactElement, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { OutlinedInput, Button, Typography, List, ListItemButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSearchParams } from 'react-router-dom';
import TodoList from '../../components/TodoList/TodoList';
import { useGetSearchParams } from '../../utils/hooks';
import Filters from './components/Filters/Filters';
import { fetchAllTodosByFilter } from '../../store/slices/todos';
import './Search.css';

const Search = (): ReactElement => {
	const dispatch = useDispatch();
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

	const onAddNew = () => {
		searchParams.set('id', 'new');
		setSearchParams(searchParams);
	};

	useEffect(() => {
		// Put default filters in url
		if (!searchParams.get('sort')) {
			searchParams.set('sort', 'title');
		}
		if (!searchParams.get('order')) {
			searchParams.set('order', 'ASC');
		}
		setSearchParams(searchParams);
	}, []);

	useEffect(() => {
		// @ts-ignore
		dispatch(fetchAllTodosByFilter({ count: 20 }));
	}, []);

	return (
		<div className="SearchContainer">
			<div className="SearchSection">
				<div className="SearchHeader">
					<div className="SearchHeader__mainFilters">
						<div className="SearchHeaderGroup">
							<OutlinedInput className="SearchByTitle" defaultValue={title}></OutlinedInput>
							<Button className="SearchButton" onClick={onShowAllFilters}>
								{showAll ? <RemoveIcon /> : <MoreHorizIcon />}
							</Button>
						</div>
						<div className="SearchByOther"></div>
						<Button className="SearchButton SearchButton__Search" onClick={onSubmit}>
							<Typography>Search</Typography>
						</Button>
					</div>
					{showAll && <Filters className="SearchHeader__restFilters" />}
					<Button className="SearchButton SearchButton--responsive" onClick={onSubmit}>
						<Typography>Search</Typography>
					</Button>
				</div>
				<List component="div" className="SearchResult"></List>
				<Button className="SearchButton SearchButton__AddNew" onClick={onAddNew}>
					<Typography>Add new</Typography>
				</Button>
			</div>
			{id && (
				<div className="SearchSection TodoListSection">
					<TodoList id={id} onClose={onClose} />
				</div>
			)}
		</div>
	);
};

export default Search;
