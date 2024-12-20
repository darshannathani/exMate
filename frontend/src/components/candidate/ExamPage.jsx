import { useState, useEffect } from 'react';
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
import ExamTimerDisplay from './ExamTimerDisplay';
import FullScreenHandler from './FullScreenHandler';

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

    const handleSectionSubmit = async (section) => {
        try {
            setIsSubmitting(true);
            
            const prepareResponses = (section) => {
                if (section === 'PROGRAMMING') {
                    return Object.entries(codeAnswers).map(([questionId, programmingResponse]) => ({
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
                setCurrentSection(sections[currentIndex + 1]);
                setCurrentQuestionIndex(0);
            }
        } catch (error) {
            console.error(`Failed to submit ${section} section`, error);
        } finally {
            setIsSubmitting(false);
            setConfirmSubmitOpen(false);
        }
    };

    const handleEndExam = async () => {
        try {
            setIsSubmitting(true);
            await candidateService.endExam(Number(examId));
            setExamEnded(true);
            setConfirmSubmitOpen(false);
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
    }, [examId, navigate]);


    const handleAnswerSelect = (questionId, selectedOption) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionId]: selectedOption
        }));
    };

    const handleTabSwitch = async () => {
        if (!examEnded) {
            try {
                await handleEndExam();
            } catch (error) {
                console.error('Failed to end exam on tab switch', error);
            }
        }
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

        if (currentSection === 'PROGRAMMING') {
            return (
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
            );
        }

        return (
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
        );
    };

    if (!examDetails) return null;

    return (
        <FullScreenHandler onTabSwitch={handleTabSwitch} isExamEnded={examEnded}>
            <Container maxWidth="xl" sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <ExamTimerDisplay 
                    totalTime={examDetails.duration} 
                    onTimeUp={() => handleSectionSubmit(currentSection)} 
                />
                
                <Tabs 
                    value={currentSection} 
                    onChange={(_, newValue) => setCurrentSection(newValue)}
                >
                    <Tab label="Logical" value="LOGICAL" />
                    <Tab label="Technical" value="TECHNICAL" />
                    <Tab label="Programming" value="PROGRAMMING" />
                </Tabs>

                <Grid container spacing={2} sx={{ height: '100%', mt: 2 }}>
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
                        {renderQuestion()}
                        
                        <Box sx={{ position: 'fixed', top: 16, right: 16 }}>
                            <Button
                                variant="contained"
                                color="error"
                                onClick={() => setConfirmSubmitOpen(true)}
                                disabled={examEnded}
                            >
                                End Exam
                            </Button>
                        </Box>
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
        </FullScreenHandler>
    );
};

export default ExamPage;