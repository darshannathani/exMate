import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
    Box, 
    Typography, 
    Button, 
    Radio, 
    RadioGroup, 
    FormControlLabel, 
    Container, 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions,
    Paper,
    Grid,
    Tooltip
} from '@mui/material';
import { candidateService } from '../../api/services/candidateService';
import ExamTimerDisplay from './ExamTimerDisplay';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
    const [examDetails, setExamDetails] = useState(null);
    const [tabSwitchCount, setTabSwitchCount] = useState(0);
    const [fullScreenWarningOpen, setFullScreenWarningOpen] = useState(false);

    const handleVisibilityChange = useCallback(() => {
        setTabSwitchCount(prev => prev + 1);
        
        if (tabSwitchCount >= 2) {
            handleSubmitExam(true);
        }
    }, [tabSwitchCount]);

    const enterFullScreen = useCallback(() => {
        const docElm = document.documentElement;
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        } else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        } else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        } else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    }, []);
    const handleFullScreenChange = useCallback(() => {
        if (!document.fullscreenElement) {
            setFullScreenWarningOpen(true);
        }
    }, []);

    useEffect(() => {
        if (!examId) {
            navigate('/candidate/available-exams');
            return;
        }

        const fetchExamQuestions = async () => {
            try {
                const parsedExamId = Number(examId);
                const response = await candidateService.startExam(parsedExamId);
                setQuestions(response.questions);
                setExamDetails(response.examDetails);
            } catch (error) {
                console.error('Failed to fetch exam questions', error);
                navigate('/candidate/available-exams');
            }
        };

        fetchExamQuestions();
        enterFullScreen();
        const preventExit = (e) => {
            e.preventDefault();
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('contextmenu', preventExit);

        return () => {
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('contextmenu', preventExit);
        };
    }, [examId, navigate, enterFullScreen, handleVisibilityChange, handleFullScreenChange]);

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };
    const handleSubmitExam = async (autoSubmit = false) => {
        try {
            setIsSubmitting(true);
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            const response = await candidateService.submitExam({
                examId: Number(examId),
                answers: selectedAnswers,
                autoSubmitReason: autoSubmit ? 'Tab Switch' : 'Manual Submit'
            });

            const resultObject = {
                status: response.status,
                examTitle: examDetails.title,
                score: response.score,
                totalQuestions: questions.length,
                correctAnswers: response.correctAnswers || 0,
                incorrectAnswers: response.incorrectAnswers || 0
            };

            navigate('/exam-result', { 
                state: { 
                    result: resultObject 
                } 
            });
        } catch (error) {
            console.error('Exam submission failed', error);
            navigate('/candidate/available-exams');
        } finally {
            setIsSubmitting(false);
        }
    };
    const examInstructions = [
        'Read each question carefully',
        'You cannot go back to previous questions',
        'Once submitted, answers cannot be changed',
        'Switching tabs will result in exam submission',
        'Maintain full-screen throughout the exam'
    ];
    const handleQuestionSelect = (index) => {
        setCurrentQuestionIndex(index);
    };
    if (!examDetails) return null;

    return (
        <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
            <ExamTimerDisplay 
                totalTime={examDetails.duration} 
                onTimeUp={() => handleSubmitExam(true)} 
            />
            <Dialog open={fullScreenWarningOpen}>
                <DialogTitle>Full Screen Required</DialogTitle>
                <DialogContent>
                    <Typography>
                        Leaving full-screen mode will automatically submit your exam.
                        Are you sure you want to continue?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setFullScreenWarningOpen(false);
                        enterFullScreen();
                    }}>
                        Stay in Exam
                    </Button>
                    <Button 
                        color="primary" 
                        variant="contained"
                        onClick={() => handleSubmitExam(true)}
                    >
                        Submit Exam
                    </Button>
                </DialogActions>
            </Dialog>

            <Grid container spacing={2} sx={{ height: '100%' }}>
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Question Map
                        </Typography>
                        {questions.map((q, index) => (
                            <Tooltip key={q.question_id} title={`Question ${index + 1}`}>
                                <Button
                                    variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                                    color={selectedAnswers[q.question_id] ? 'success' : 'primary'}
                                    onClick={() => handleQuestionSelect(index)}
                                    sx={{ m: 0.5, minWidth: 40 }}
                                >
                                    {index + 1}
                                </Button>
                            </Tooltip>
                        ))}
                    </Paper>
                </Grid>
                <Grid item xs={8}>
                    <Box sx={{ width: '100%', mt: 4 }}>
                        <Typography variant="h5" gutterBottom>
                            Question {currentQuestionIndex + 1} of {questions.length}
                        </Typography>

                        <Typography variant="h6" sx={{ mb: 3 }}>
                            {questions[currentQuestionIndex].question_text}
                        </Typography>

                        <RadioGroup
                            value={selectedAnswers[questions[currentQuestionIndex].question_id] || ''}
                            onChange={(e) => handleAnswerSelect(
                                questions[currentQuestionIndex].question_id, 
                                e.target.value
                            )}
                        >
                            {questions[currentQuestionIndex].options.map((option) => (
                                <FormControlLabel
                                    key={option.option_id}
                                    value={option.option_id}
                                    control={<Radio />}
                                    label={option.option_text}
                                />
                            ))}
                        </RadioGroup>

                        <Box sx={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            mt: 4 
                        }}>
                            <Button 
                                variant="outlined" 
                                onClick={() => setCurrentQuestionIndex(prev => prev - 1)}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </Button>
                            {currentQuestionIndex === questions.length - 1 ? (
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => setConfirmSubmitOpen(true)}
                                >
                                    Submit Exam
                                </Button>
                            ) : (
                                <Button 
                                    variant="contained" 
                                    color="primary"
                                    onClick={() => setCurrentQuestionIndex(prev => prev + 1)}
                                >
                                    Next
                                </Button>
                            )}
                        </Box>
                    </Box>
                </Grid>
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Exam Instructions
                        </Typography>
                        {examInstructions.map((instruction, index) => (
                            <Typography 
                                key={index} 
                                variant="body2" 
                                paragraph 
                                color="text.secondary"
                            >
                                {index + 1}. {instruction}
                            </Typography>
                        ))}
                    </Paper>
                </Grid>
            </Grid>
            <Dialog
                open={confirmSubmitOpen}
                onClose={() => setConfirmSubmitOpen(false)}
            >
                <DialogTitle>Confirm Exam Submission</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to submit the exam? 
                        You cannot change your answers after submission.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmSubmitOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="primary" 
                        onClick={() => handleSubmitExam()}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExamPage;