import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Paper 
} from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ExamResultPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    if (!location.state || !location.state.result) {
        navigate('/candidate/available-exams');
        return null;
    }

    const result = location.state.result;

    const {
        examTitle = 'Unknown Exam',
        status = 'Pending',
        score = null,
        totalQuestions = null,
        correctAnswers = null,
        incorrectAnswers = null
    } = result;

    const handleReturnToExams = () => {
        navigate('/candidate/available-exams');
    };

    const getResultColor = (status) => {
        if (status === 'Pass') return 'success.main';
        if (status === 'Fail') return 'error.main';
        return 'text.primary';
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                {status === 'Pending' || score === null ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5" color="text.secondary">
                            Results Not Generated Yet
                        </Typography>
                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleReturnToExams}
                            sx={{ mt: 3 }}
                        >
                            Return to Available Exams
                        </Button>
                    </Box>
                ) : (
                    <>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            {status === 'Pass' ? (
                                <CheckCircleOutlineIcon 
                                    sx={{ fontSize: 100, color: getResultColor(status) }} 
                                />
                            ) : (
                                <HighlightOffIcon 
                                    sx={{ fontSize: 100, color: getResultColor(status) }} 
                                />
                            )}
                            <Typography 
                                variant="h4" 
                                sx={{ mt: 2, color: getResultColor(status) }}
                            >
                                {status}
                            </Typography>
                        </Box>

                        <Box>
                            <Typography variant="subtitle1">Exam Title</Typography>
                            <Typography variant="body1" fontWeight="bold">{examTitle}</Typography>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Total Score</Typography>
                            <Typography 
                                variant="body1" 
                                fontWeight="bold" 
                                color={getResultColor(status)}
                            >
                                {isNaN(score) ? 'N/A' : `${score}%`}
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3 }}>
                            <Typography variant="subtitle1">Questions Breakdown</Typography>
                            <Typography variant="body2">Total: {totalQuestions || 'N/A'}</Typography>
                            <Typography variant="body2" color="success.main">
                                Correct: {correctAnswers || 'N/A'}
                            </Typography>
                            <Typography variant="body2" color="error.main">
                                Incorrect: {incorrectAnswers || 'N/A'}
                            </Typography>
                        </Box>

                        <Button 
                            variant="contained" 
                            color="primary" 
                            onClick={handleReturnToExams}
                            sx={{ mt: 4 }}
                        >
                            Return to Available Exams
                        </Button>
                    </>
                )}
            </Paper>
        </Container>
    );
};

export default ExamResultPage;
