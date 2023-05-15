import { ReactElement, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { OutlinedInput, Button, Typography, List, ListItemButton } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveIcon from '@mui/icons-material/Remove';
import { useSearchParams } from 'react-router-dom';
import TodoList from '../../components/TodoList/TodoList';
import { useGetSearchParams } from '../../utils/hooks';
import Filters from './components/Filters/Filters';
import { fetchAllTodosByFilter } from '../../store/slices/todos';
import { selectTodos } from '../../store/selectors/todosSelectors';
import './Search.css';

const Search = (): ReactElement => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const { id, title } = useGetSearchParams();
	const list = useSelector(selectTodos);

	const [showAll, setShowAll] = useState(false);

	const onAction = useCallback(
		(action: 'add' | 'ed' | 'close', value = '') => {
			if (action === 'add' || action === 'close') {
				searchParams.set('id', value);
			}
			setSearchParams(searchParams);
		},
		[searchParams]
	);

	const onSubmit = () => {
		// TODO Get all filters in Inputs, set them to url
		console.log(localStorage.getItem('todosData'));
	};

	const onShowAllFilters = () => {
		setShowAll((value) => !value);
	};

	const onAddNew = () => {
		searchParams.set('id', 'new');
		setSearchParams(searchParams);
	};

	const onItemClick = (itemId: string) => {
		searchParams.set('id', itemId);
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
				<List component="div" className="SearchResult">
					{list.map((listItem) => (
						<ListItemButton
							key={listItem.id}
							className="SearchResult__item"
							onClick={() => onItemClick(listItem.id)}
						>
							<Typography variant="subtitle1">{listItem.title}</Typography>
						</ListItemButton>
					))}
				</List>
				<Button className="SearchButton SearchButton__AddNew" onClick={onAddNew}>
					<Typography>Add new</Typography>
				</Button>
			</div>
			{id && (
				<div className="SearchSection TodoListSection">
					<TodoList id={id} onAction={onAction} />
				</div>
			)}
		</div>
	);
};

export default Search;
