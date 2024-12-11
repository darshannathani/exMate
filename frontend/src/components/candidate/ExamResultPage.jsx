import { 
    Box, 
    Container, 
    Typography, 
    Button, 
    Paper, 
    Grid, 
    Divider 
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

    const { result } = location.state;

    const getResultColor = (status) => {
        return status === 'Pass' ? 'success.main' : 'error.main';
    };

    const handleReturnToExams = () => {
        navigate('/candidate/available-exams');
    };

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
                <Box sx={{ 
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: 'center',
                    mb: 3 
                }}>
                    {result.status === 'Pass' ? (
                        <CheckCircleOutlineIcon 
                            sx={{ 
                                fontSize: 100, 
                                color: getResultColor(result.status) 
                            }} 
                        />
                    ) : (
                        <HighlightOffIcon 
                            sx={{ 
                                fontSize: 100, 
                                color: getResultColor(result.status) 
                            }} 
                        />
                    )}
                    <Typography 
                        variant="h4" 
                        sx={{ 
                            mt: 2, 
                            color: getResultColor(result.status) 
                        }}
                    >
                        {result.status}
                    </Typography>
                </Box>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">
                            Exam Title
                        </Typography>
                        <Typography variant="body1" fontWeight="bold">
                            {result.examTitle}
                        </Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="subtitle1">
                            Total Score
                        </Typography>
                        <Typography 
                            variant="body1" 
                            fontWeight="bold"
                            color={getResultColor(result.status)}
                        >
                            {result.score}%
                        </Typography>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }} />

                <Grid container spacing={2}>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1">Total Questions</Typography>
                        <Typography variant="body1">
                            {result.totalQuestions}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1">Correct Answers</Typography>
                        <Typography variant="body1" color="success.main">
                            {result.correctAnswers}
                        </Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle1">Incorrect Answers</Typography>
                        <Typography variant="body1" color="error.main">
                            {result.incorrectAnswers}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 4 }}>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={handleReturnToExams}
                        fullWidth
                    >
                        Return to Available Exams
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default ExamResultPage;