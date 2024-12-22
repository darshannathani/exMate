import { useState, useEffect, useRef } from 'react';
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
    Tooltip,
    Tabs,
    Tab
} from '@mui/material';
import { Editor } from '@monaco-editor/react';
import { candidateService } from '../../api/services/candidateService';

const ExamPage = () => {
    const { examId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentSection, setCurrentSection] = useState('LOGICAL');
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [codeAnswers, setCodeAnswers] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [confirmSubmitOpen, setConfirmSubmitOpen] = useState(false);
    const [examDetails, setExamDetails] = useState(null);
    const [examEnded, setExamEnded] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0);
    const [lastQuestionIndices, setLastQuestionIndices] = useState({
        LOGICAL: 0,
        TECHNICAL: 0,
        PROGRAMMING: 0
    });

    const isMountedRef = useRef(false);
    useEffect(() => {
        if (remainingTime > 0) {
            const timer = setInterval(() => {
                setRemainingTime(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        handleEndExam();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [remainingTime]);
    useEffect(() => {
        if (examDetails) {
            setRemainingTime(examDetails.duration * 60);
        }
    }, [examDetails]);
    useEffect(() => {
        if (isMountedRef.current) return;
        isMountedRef.current = true;

        const fetchExamQuestions = async () => {
            if (!examId) {
                navigate('/candidate/available-exams');
                return;
            }

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
    }, [examId, navigate]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const exitFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    };

    const handleSectionChange = (newSection) => {
        setLastQuestionIndices(prev => ({
            ...prev,
            [currentSection]: currentQuestionIndex
        }));
        setCurrentSection(newSection);
        setCurrentQuestionIndex(lastQuestionIndices[newSection]);
    };

    const handleSectionSubmit = async (section) => {
        try {
            setIsSubmitting(true);

            const prepareResponses = (section) => {
                if (section === 'PROGRAMMING') {
                    return Object.entries(codeAnswers)
                        .filter(([qId]) =>
                            questions.find(q =>
                                q.question.question_id === Number(qId) &&
                                q.question.section_type === section
                            )
                        )
                        .map(([questionId, programmingResponse]) => ({
                            question: { question_id: Number(questionId) },
                            programming_response: programmingResponse
                        }));
                }

                return Object.entries(selectedAnswers)
                    .filter(([qId]) =>
                        questions.find(q =>
                            q.question.question_id === Number(qId) &&
                            q.question.section_type === section
                        )
                    )
                    .map(([questionId, optionId]) => ({
                        question: { question_id: Number(questionId) },
                        option: { option_id: Number(optionId) }
                    }));
            };

            const responses = prepareResponses(section);
            await candidateService.submitResponses(Number(examId), responses);

            const sections = ['LOGICAL', 'TECHNICAL', 'PROGRAMMING'];
            const currentIndex = sections.indexOf(section);
            if (currentIndex < sections.length - 1) {
                handleSectionChange(sections[currentIndex + 1]);
            }
        } catch (error) {
            console.error(`Failed to submit ${section} section`, error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEndExam = async () => {
        try {
            setIsSubmitting(true);
            await candidateService.endExam(Number(examId));
            setExamEnded(true);
            setConfirmSubmitOpen(false);
            exitFullScreen();
            navigate('/candidate/exam-result');
        } catch (error) {
            console.error('Failed to end exam', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const sectionedQuestions = {
        LOGICAL: questions.filter(q => q.question.section_type === 'LOGICAL'),
        TECHNICAL: questions.filter(q => q.question.section_type === 'TECHNICAL'),
        PROGRAMMING: questions.filter(q => q.question.section_type === 'PROGRAMMING')
    };

    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleCodeAnswer = (questionId, code) => {
        setCodeAnswers(prev => ({
            ...prev,
            [questionId]: code
        }));
    };

    const renderQuestion = () => {
        const currentQuestions = sectionedQuestions[currentSection];
        const question = currentQuestions[currentQuestionIndex];
        if (!question) return null;

        return (
            <Box sx={{ mb: 4 }}>
                {currentSection === 'PROGRAMMING' ? (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            {question.question.text}
                        </Typography>
                        <Editor
                            height="400px"
                            defaultLanguage="python"
                            value={codeAnswers[question.question.question_id] || ''}
                            onChange={(value) => handleCodeAnswer(question.question.question_id, value || '')}
                            options={{
                                minimap: { enabled: false },
                                fontSize: 14,
                            }}
                        />
                    </Box>
                ) : (
                    <Box>
                        <Typography variant="h6" sx={{ mb: 3 }}>
                            {question.question.text}
                        </Typography>
                        <RadioGroup
                            value={selectedAnswers[question.question.question_id] || ''}
                            onChange={(e) => handleAnswerSelect(question.question.question_id, e.target.value)}
                        >
                            {question.options.map((option) => (
                                <FormControlLabel
                                    key={option.option_id}
                                    value={option.option_id}
                                    control={<Radio />}
                                    label={option.option_text}
                                />
                            ))}
                        </RadioGroup>
                    </Box>
                )}
            </Box>
        );
    };

    if (!examDetails) return null;

    return (
        <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', py: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h6" component="div">
                        Time Remaining: {formatTime(remainingTime)}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    color="error"
                    onClick={() => setConfirmSubmitOpen(true)}
                    disabled={examEnded}
                >
                    End Exam
                </Button>
            </Box>
            
            <Tabs 
                value={currentSection} 
                onChange={(_, newValue) => handleSectionChange(newValue)}
                sx={{ mb: 2 }}
            >
                <Tab label="Logical" value="LOGICAL" />
                <Tab label="Technical" value="TECHNICAL" />
                <Tab label="Programming" value="PROGRAMMING" />
            </Tabs>

            <Grid container spacing={2} sx={{ flex: 1 }}>
                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Question Map
                        </Typography>
                        {sectionedQuestions[currentSection].map((q, index) => (
                            <Tooltip 
                                key={q.question.question_id} 
                                title={`Question ${index + 1} (${q.question.marks} marks)`}
                            >
                                <Button
                                    variant={currentQuestionIndex === index ? 'contained' : 'outlined'}
                                    color={
                                        (currentSection === 'PROGRAMMING' && 
                                         codeAnswers[q.question.question_id]) ||
                                        selectedAnswers[q.question.question_id] 
                                            ? 'success' 
                                            : 'primary'
                                    }
                                    onClick={() => setCurrentQuestionIndex(index)}
                                    sx={{ m: 0.5, minWidth: 40 }}
                                >
                                    {index + 1}
                                </Button>
                            </Tooltip>
                        ))}
                    </Paper>
                </Grid>
                
                <Grid item xs={8}>
                    <Paper elevation={3} sx={{ p: 3, height: '100%', overflowY: 'auto' }}>
                        {renderQuestion()}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                            <Button
                                variant="contained"
                                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQuestionIndex === 0}
                            >
                                Previous
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => handleSectionSubmit(currentSection)}
                                disabled={isSubmitting}
                            >
                                Submit Section
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => setCurrentQuestionIndex(prev => 
                                    Math.min(sectionedQuestions[currentSection].length - 1, prev + 1)
                                )}
                                disabled={currentQuestionIndex === sectionedQuestions[currentSection].length - 1}
                            >
                                Next
                            </Button>
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={2}>
                    <Paper elevation={3} sx={{ p: 2, height: '100%', overflowY: 'auto' }}>
                        <Typography variant="h6" gutterBottom>
                            Section Progress
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Questions Attempted: {
                                currentSection === 'PROGRAMMING' 
                                    ? Object.keys(codeAnswers).filter(id => 
                                        questions.find(q => 
                                            q.question.question_id === Number(id) && 
                                            q.question.section_type === currentSection
                                        )
                                    ).length
                                    : Object.keys(selectedAnswers).filter(id => 
                                        questions.find(q => 
                                            q.question.question_id === Number(id) && 
                                            q.question.section_type === currentSection
                                        )
                                    ).length
                            } / {sectionedQuestions[currentSection].length}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Marks: {
                                sectionedQuestions[currentSection].reduce(
                                    (sum, q) => sum + q.question.marks, 
                                    0
                                )
                            }
                        </Typography>
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
                        Are you sure you want to end the exam? 
                        This action cannot be undone and you won&apos;t be able to modify any answers.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmSubmitOpen(false)}>
                        Cancel
                    </Button>
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleEndExam}
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'End Exam'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExamPage;