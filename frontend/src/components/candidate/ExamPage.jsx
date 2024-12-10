import { useState, useEffect } from 'react';
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
    DialogActions 
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { candidateService } from '../../api/services/candidateService';
import ExamTimerDisplay from './ExamTimerDisplay';
import FullScreenHandler from './FullScreenHandler';

const ExamPage = () => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);

    const navigate = useNavigate();
    const { examId } = useParams();
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (e.key === 'F5' || (e.ctrlKey && e.key === 'R')) {
                e.preventDefault();
            }
            if (e.key === 'Backspace') {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, []);
    useEffect(() => {
        const fetchExamQuestions = async () => {
            try {
                const response = await candidateService.startExam(examId);
                setQuestions(response.questions);
            } catch (error) {
                console.error('Failed to fetch exam questions', error);
                navigate('/exams');
            }
        };

        fetchExamQuestions();
    }, [examId, navigate]);

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleNextQuestion = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        }
    };

    const handleSubmitExam = async () => {
        try {
            setIsSubmitting(true);
            const response = await candidateService.submitExam({
                examId,
                answers: selectedAnswers
            });
            navigate('/exam-result', { state: { result: response } });
        } catch (error) {
            console.error('Exam submission failed', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];

    if (!currentQuestion) return null;

    return (
        <FullScreenHandler>
            <Container maxWidth="md" sx={{ 
                height: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center'
            }}>
                <ExamTimerDisplay 
                    totalTime={questions[0]?.exam_duration || 60} 
                    onTimeUp={handleSubmitExam} 
                />

                <Box sx={{ width: '100%', mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </Typography>

                    <Typography variant="h6" sx={{ mb: 3 }}>
                        {currentQuestion.question_text}
                    </Typography>

                    <RadioGroup
                        value={selectedAnswers[currentQuestion.question_id] || ''}
                        onChange={(e) => handleAnswerSelect(
                            currentQuestion.question_id, 
                            e.target.value
                        )}
                    >
                        {currentQuestion.options.map((option) => (
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
                            onClick={handlePreviousQuestion}
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
                                onClick={handleNextQuestion}
                            >
                                Next
                            </Button>
                        )}
                    </Box>
                </Box>
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
                            onClick={handleSubmitExam}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Submitting...' : 'Confirm Submit'}
                        </Button>
                    </DialogActions>
                </Dialog>
            </Container>
        </FullScreenHandler>
    );
};

export default ExamPage;