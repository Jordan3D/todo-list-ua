import { ReactElement, RefObject, useEffect, useState, useRef, ChangeEvent } from 'react';
import { Button, OutlinedInput, ListItemButton } from '@mui/material';
import './NewItem.css';

/**
 * Hook that alerts clicks outside of the passed ref
 */
function useOutsideAlerter(ref: RefObject<HTMLInputElement>, func: () => void) {
	useEffect(() => {
		/**
		 * Alert if clicked on outside of element
		 */
		function handleClickOutside(event: MouseEvent) {
			if (ref.current && !ref.current.contains(event.target as HTMLButtonElement)) {
				func();
			}
		}
		// Bind the event listener
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			// Unbind the event listener on clean up
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [ref]);
}

const NewItem = ({ onAdd }: { onAdd: (value: string) => void }): ReactElement => {
	const [addNew, setAddNew] = useState(false);
	const [newItemValue, setNewItemValue] = useState('');
	const wrapperRef = useRef(null);

	const onAddActivate = () => {
		setAddNew(true);
	};

	const onAddDisable = () => {
		if (!newItemValue.length) {
			setAddNew(false);
		}
	};

	const onNewInputChange = (e: ChangeEvent<HTMLInputElement>) => {
		setNewItemValue(e.target.value);
	};

	const onCancelHandler = () => {
		setNewItemValue('');
		setAddNew(false);
	};

	const onAddHandler = () => {
		onAdd(newItemValue);
		onCancelHandler();
	};

	useOutsideAlerter(wrapperRef, onAddDisable);

	return (
		<ListItemButton className="NewItem" ref={wrapperRef} onClick={onAddActivate}>
			{addNew ? (
				<div className="NewItem__form">
					<OutlinedInput value={newItemValue} onChange={onNewInputChange} />
					<div className="NewItem__side">
						<Button onClick={onAddHandler}>Add</Button>
						<Button onClick={onCancelHandler}>Cancel</Button>
					</div>
				</div>
			) : (
				'Add new'
			)}
		</ListItemButton>
	);
};

export default NewItem;
