import { ChangeEvent, ReactElement, memo, useRef } from 'react';
import { useDispatch } from 'react-redux';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import { Button } from '@mui/material';
import { fetchAllData, setAllData } from '../../../../store/slices/todos';
import { IListEntity } from '../../../../types';
import './Settings.css';

const Settings = ({ className }: { className?: string }): ReactElement => {
	const dispatch = useDispatch();
	const inputUploadRef = useRef<HTMLInputElement | null>(null);

	const onChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			const file = e.target.files[0];
			const fileReader = new FileReader();
			fileReader.onload = (evt) => {
				try {
					const res = evt.target?.result as string;
					const result = JSON.parse(res) as Record<string, IListEntity>;
					/* eslint-disable */
					//@ts-ignore
					dispatch(setAllData(result));
					/* eslint-enable */
				} catch (err) {
					console.error('Something is wrong with file upload');
				}
			};
			fileReader.readAsText(file);
		}
	};

	const onSave = () => {
		/* eslint-disable */
		//@ts-ignore
		dispatch(fetchAllData())
			.unwrap()
			.then((res: Record<string, IListEntity>) => {
				const fileData = JSON.stringify(res);
				const blob = new Blob([fileData], { type: 'text/plain' });
				const url = URL.createObjectURL(blob);
				const link = document.createElement('a');
				link.download = 'storage.json';
				link.href = url;
				link.click();
			});
		/* eslint-enable */
	};

	const onUpload = () => {
		if (inputUploadRef.current) {
			inputUploadRef.current.click();
		}
	};

	return (
		<div className={`${className ?? ''} Settings`}>
			<Button className="SearchViewButton SearchViewButton__Save" onClick={onSave}>
				<SaveIcon />
			</Button>
			<div className="UploadFile">
				<input
					type="file"
					className="UploadInput"
					onChange={onChangeHandler}
					ref={inputUploadRef}
				/>
				<Button className="SearchViewButton SearchViewButton__Upload" onClick={onUpload}>
					<UploadIcon />
				</Button>
			</div>
		</div>
	);
};

export default memo(Settings);
