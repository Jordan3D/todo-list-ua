import { ReactElement, memo, useState, useCallback, ChangeEvent } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Input, Typography } from '@mui/material';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import RemoveIcon from '@mui/icons-material/Remove';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSearchParams } from 'react-router-dom';
import Filters from '../Filters/Filters';
import Settings from '../Settings/Settings';
import { useGetSearchParams } from '../../../../utils/hooks';
import { set as setFilter } from '../../../../store/slices/filters';
import { fetchAllTodosByFilter } from '../../../../store/slices/todos';
import { ISearchQuery } from '../../../../types';
import './Search.css';

const Search = (): ReactElement => {
	const dispatch = useDispatch();
	const [searchParams, setSearchParams] = useSearchParams();
	const { search }: ISearchQuery = useGetSearchParams();

	const [showAll, setShowAll] = useState(false);
	const [settingsVisible, setSettingsVisible] = useState(false);
	const [searchValue, setSearchValue] = useState(search || '');

	const onShowAllFilters = useCallback(() => {
		setShowAll((value) => !value);
	}, []);

	const onSearchInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
	};

	const onToggleSettings = () => setSettingsVisible(!settingsVisible);

	const onSubmit = () => {
		dispatch(setFilter({ map: { search: searchValue } }));
		setTimeout(() => {
			/* eslint-disable */
			//@ts-ignore
			dispatch(fetchAllTodosByFilter())
				.unwrap()
				.then(() => {
					searchParams.set('search', searchValue);
					setSearchParams(searchParams);
				});
			/* eslint-enable */
		}, 100);
	};

	return (
		<div className="SearchHeader">
			<div className="SearchHeader__mainFilters">
				<div className="SearchHeaderGroup">
					<Input className="SearchInput" onChange={onSearchInputChange} value={searchValue}></Input>
					<div className="SearchHeader__Buttons">
						<Button className="SearchViewButton SearchViewButton__Rest" onClick={onShowAllFilters}>
							{showAll ? <RemoveIcon /> : <MoreHorizIcon />}
						</Button>
						<Button
							className="SearchViewButton SearchViewButton__Settings"
							onClick={onToggleSettings}
						>
							<SettingsIcon />
						</Button>
					</div>
				</div>
				<div className="SearchByOther"></div>
				<Button className="SearchViewButton SearchViewButton__Search" onClick={onSubmit}>
					<Typography>Search</Typography>
				</Button>
			</div>
			{showAll && <Filters className="SearchHeader__restFilters" />}
			{settingsVisible && <Settings className="SearchHeader__settings" />}
			<Button className="SearchViewButton SearchViewButton--responsive" onClick={onSubmit}>
				<Typography>Search</Typography>
			</Button>
		</div>
	);
};

export default memo(Search);
