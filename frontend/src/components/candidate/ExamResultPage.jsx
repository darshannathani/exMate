import { useState, useEffect } from 'react';
import { authService } from '../../api/services/authService';
import {
    Container,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Box,
    CircularProgress,
    Button,
    Tabs,
    Tab
} from '@mui/material';
import { candidateService } from '../../api/services/candidateService';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

const ExamResultPage = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedExam, setSelectedExam] = useState(null);
    const [sectionAnalysis, setSectionAnalysis] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [candidateId, setCandidateId] = useState(null);

    useEffect(() => {
        const initializeData = async () => {
            try {
                setLoading(true);
                // Use authService to decode the token
                const decodedToken = await authService.tokenDecode();
                
                // Extract candidateId from sub field
                const candidateId = decodedToken.sub;
                setCandidateId(candidateId);

                // Fetch results if we have a valid candidateId
                if (candidateId) {
                    const response = await candidateService.getAllResults(candidateId);
                    setResults(response);
                }
            } catch (err) {
                console.error('Error initializing data:', err);
                setError('Failed to authenticate. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        initializeData();
    }, []);

    const handleExamClick = async (examId) => {
        try {
            const [detailedResult, sectionWiseAnalysis] = await Promise.all([
                candidateService.getDetailedExamResult(candidateId, examId),
                candidateService.getSectionWiseAnalysis(candidateId, examId)
            ]);
            setSelectedExam(detailedResult);
            setSectionAnalysis(sectionWiseAnalysis);
        } catch (err) {
            console.error('Error fetching exam details:', err);
            alert('Failed to fetch exam details');
        }
    };

    const getStatusIcon = (status) => {
        return status === 'Pass' ? (
            <CheckCircleOutlineIcon sx={{ color: 'success.main' }} />
        ) : (
            <HighlightOffIcon sx={{ color: 'error.main' }} />
        );
    };

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (loading) {
        return (
            <Container sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Container>
        );
    }

    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error" align="center">
                    {error}
                </Typography>
            </Container>
        );
    }

    if (!candidateId) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error" align="center">
                    Invalid or missing session. Please log in again.
                </Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom>
                Exam Results
            </Typography>

            {selectedExam ? (
                <Paper elevation={3} sx={{ p: 3 }}>
                    <Button 
                        onClick={() => setSelectedExam(null)} 
                        variant="outlined" 
                        sx={{ mb: 2 }}
                    >
                        Back to Results
                    </Button>
                    
                    <Tabs value={tabValue} onChange={handleTabChange}>
                        <Tab label="Details" />
                        <Tab label="Section Analysis" />
                    </Tabs>

                    {tabValue === 0 && (
                        <Box sx={{ mt: 3 }}>
                            <Typography variant="h6" gutterBottom>
                                {selectedExam.examTitle}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'space-around', mb: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3">{selectedExam.score}</Typography>
                                    <Typography variant="subtitle1">Score</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="h3">{selectedExam.status}</Typography>
                                    <Typography variant="subtitle1">Status</Typography>
                                </Box>
                            </Box>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Category</TableCell>
                                            <TableCell align="center">Results</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell>Total Questions</TableCell>
                                            <TableCell align="center">{selectedExam.totalQuestions}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Correct Answers</TableCell>
                                            <TableCell align="center">{selectedExam.correctAnswers}</TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>Incorrect Answers</TableCell>
                                            <TableCell align="center">{selectedExam.incorrectAnswers}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}

                    {tabValue === 1 && sectionAnalysis && (
                        <Box sx={{ mt: 3 }}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Section</TableCell>
                                            <TableCell align="center">Questions</TableCell>
                                            <TableCell align="center">Correct</TableCell>
                                            <TableCell align="center">Score</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {sectionAnalysis.map((section) => (
                                            <TableRow key={section.section_type}>
                                                <TableCell>{section.section_type}</TableCell>
                                                <TableCell align="center">{section.total_questions}</TableCell>
                                                <TableCell align="center">{section.correct_answers}</TableCell>
                                                <TableCell align="center">{section.score}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
                </Paper>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Exam Title</TableCell>
                                <TableCell align="center">Date</TableCell>
                                <TableCell align="center">Score</TableCell>
                                <TableCell align="center">Status</TableCell>
                                <TableCell align="center">Details</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {results.map((result) => (
                                <TableRow key={result.exam_id}>
                                    <TableCell>{result.examTitle}</TableCell>
                                    <TableCell align="center">
                                        {new Date(result.completion_date).toLocaleDateString()}
                                    </TableCell>
                                    <TableCell align="center">{result.score}</TableCell>
                                    <TableCell align="center">
                                        {getStatusIcon(result.status)}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleExamClick(result.exam_id)}
                                        >
                                            View Details
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default ExamResultPage;