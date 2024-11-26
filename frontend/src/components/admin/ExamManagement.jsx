import { useState, useEffect } from 'react';
import {
    Container,
    Typography,
    Paper,
    Button,
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    IconButton,
    Tooltip,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { examService } from '../../api/services/examService';

const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);

    const emptyQuestion = {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 'easy',
        category: '',
    };
    const [newQuestion, setNewQuestion] = useState(emptyQuestion);

    const fetchExams = async () => {
        try {
            const response = await examService.getAllExams();
            setExams(response);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            alert('Failed to fetch exams.');
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    const handleAddQuestion = async () => {
        try {
            if (selectedExam) {
                await examService.addQuestionToExam(selectedExam.id, newQuestion);
                alert('Question added successfully!');
                setNewQuestion(emptyQuestion);
                setDialogOpen(false);
                await fetchExams();
            }
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Failed to add question.');
        }
    };

    const handleEditExam = (exam) => {
        setSelectedExam(exam);
        setEditDialogOpen(true);
    };

    const handleDeleteExam = async (id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await examService.deleteExam(id);
                alert('Exam deleted successfully!');
                await fetchExams();
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('Failed to delete exam.');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Exam Management
            </Typography>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Exam List</Typography>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => setDialogOpen(true)}
                    >
                        Add Question
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {console.log(exams)}
                            {exams.map((exam) => (
                                <TableRow key={exam.exam_id}>
                                    <TableCell>{exam.exam_id}</TableCell>
                                    <TableCell>{exam.title}</TableCell>
                                    <TableCell>{exam.difficulty}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => handleEditExam(exam)}
                                                sx={{ color: '#FFD700' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDeleteExam(exam.exam_id)}
                                                sx={{ color: '#FF0000' }}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth>
                <DialogTitle>Add Question</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Question"
                        fullWidth
                        margin="normal"
                        value={newQuestion.question}
                        onChange={(e) =>
                            setNewQuestion((prev) => ({ ...prev, question: e.target.value }))
                        }
                    />
                    {newQuestion.options.map((option, index) => (
                        <TextField
                            key={index}
                            label={`Option ${index + 1}`}
                            fullWidth
                            margin="normal"
                            value={option}
                            onChange={(e) =>
                                setNewQuestion((prev) => {
                                    const options = [...prev.options];
                                    options[index] = e.target.value;
                                    return { ...prev, options };
                                })
                            }
                        />
                    ))}
                    <TextField
                        label="Correct Answer"
                        fullWidth
                        margin="normal"
                        value={newQuestion.correctAnswer}
                        onChange={(e) =>
                            setNewQuestion((prev) => ({
                                ...prev,
                                correctAnswer: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        label="Difficulty"
                        fullWidth
                        margin="normal"
                        value={newQuestion.difficulty}
                        onChange={(e) =>
                            setNewQuestion((prev) => ({
                                ...prev,
                                difficulty: e.target.value,
                            }))
                        }
                    />
                    <TextField
                        label="Category"
                        fullWidth
                        margin="normal"
                        value={newQuestion.category}
                        onChange={(e) =>
                            setNewQuestion((prev) => ({
                                ...prev,
                                category: e.target.value,
                            }))
                        }
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddQuestion} color="primary">
                        Add Question
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExamManagement;
