import CircularProgress from '@mui/material/CircularProgress';
import './Start.css';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Start = () => {
	const [isReady, setIsReady] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		setTimeout(() => {
			setIsReady(true);
		}, 1000);
	}, [setIsReady]);

	useEffect(() => {
		if (isReady) {
			navigate('/menu');
		}
	}, [isReady]);

	return (
		<div className="StartContainer">
			<CircularProgress color="success" />
		</div>
	);
};

export default Start;
