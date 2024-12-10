import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import PropTypes from 'prop-types';

const ExamTimerDisplay = ({ totalTime, onTimeUp }) => {
    const [remainingTime, setRemainingTime] = useState(totalTime * 60); // Convert minutes to seconds

    useEffect(() => {
        const timer = setInterval(() => {
            setRemainingTime(prev => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [onTimeUp, totalTime]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    return (
        <Box sx={{ 
            position: 'fixed', 
            top: 20, 
            right: 20,
            backgroundColor: remainingTime < 300 ? 'error.light' : 'primary.light',
            color: 'white',
            padding: 2,
            borderRadius: 2
        }}>
            <Typography variant="h6">
                Time Remaining: {formatTime(remainingTime)}
            </Typography>
        </Box>
    );
};

ExamTimerDisplay.propTypes = {
    totalTime: PropTypes.number.isRequired,
    onTimeUp: PropTypes.func.isRequired
};

export default ExamTimerDisplay;