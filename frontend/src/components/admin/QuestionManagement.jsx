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
import { questionService } from '../../api/services/questionService';

const QuestionManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const emptyQuestion = {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        difficulty: 'easy',
        category: '',
    };
    const [newQuestion, setNewQuestion] = useState(emptyQuestion);
    const [editingQuestion, setEditingQuestion] = useState(null);

    const fetchQuestions = async () => {
        try {
            const response = await questionService.getAllQuestions();
            setQuestions(response);
        } catch (error) {
            console.error('Failed to fetch questions', error);
            alert('Failed to fetch questions.');
        }
    };

    useEffect(() => {
        fetchQuestions();
    }, []);

    const handleAddQuestion = async () => {
        try {
            await questionService.addQuestion(newQuestion);
            alert('Question added successfully!');
            setNewQuestion(emptyQuestion);
            setDialogOpen(false);
            await fetchQuestions();
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Failed to add question.');
        }
    };

    const handleEditClick = (question) => {
        setEditingQuestion(question);
        setEditDialogOpen(true);
    };

    const handleEditSave = async () => {
        try {
            await questionService.updateQuestion(editingQuestion.id, editingQuestion);
            alert('Question updated successfully!');
            await fetchQuestions();
            setEditDialogOpen(false);
            setEditingQuestion(null);
        } catch (error) {
            console.error('Error updating question:', error);
            alert('Failed to update question.');
        }
    };

    const handleDeleteQuestion = async (id) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await questionService.deleteQuestion(id);
                alert('Question deleted successfully!');
                await fetchQuestions();
            } catch (error) {
                console.error('Error deleting question:', error);
                alert('Failed to delete question.');
            }
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Question Management
            </Typography>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6">Question List</Typography>
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
                                <TableCell>Question</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question.id}>
                                    <TableCell>{question.id}</TableCell>
                                    <TableCell>{question.question}</TableCell>
                                    <TableCell>{question.category}</TableCell>
                                    <TableCell>{question.difficulty}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                onClick={() => handleEditClick(question)}
                                                sx={{ color: '#FFD700' }}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                onClick={() => handleDeleteQuestion(question.id)}
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

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth>
                <DialogTitle>Edit Question</DialogTitle>
                <DialogContent>
                    {editingQuestion && (
                        <>
                            <TextField
                                label="Question"
                                fullWidth
                                margin="normal"
                                value={editingQuestion.question}
                                onChange={(e) =>
                                    setEditingQuestion((prev) => ({
                                        ...prev,
                                        question: e.target.value,
                                    }))
                                }
                            />
                            {editingQuestion.options.map((option, index) => (
                                <TextField
                                    key={index}
                                    label={`Option ${index + 1}`}
                                    fullWidth
                                    margin="normal"
                                    value={option}
                                    onChange={(e) =>
                                        setEditingQuestion((prev) => {
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
                                value={editingQuestion.correctAnswer}
                                onChange={(e) =>
                                    setEditingQuestion((prev) => ({
                                        ...prev,
                                        correctAnswer: e.target.value,
                                    }))
                                }
                            />
                            <TextField
                                label="Difficulty"
                                fullWidth
                                margin="normal"
                                value={editingQuestion.difficulty}
                                onChange={(e) =>
                                    setEditingQuestion((prev) => ({
                                        ...prev,
                                        difficulty: e.target.value,
                                    }))
                                }
                            />
                            <TextField
                                label="Category"
                                fullWidth
                                margin="normal"
                                value={editingQuestion.category}
                                onChange={(e) =>
                                    setEditingQuestion((prev) => ({
                                        ...prev,
                                        category: e.target.value,
                                    }))
                                }
                            />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleEditSave} color="primary">
                        Save Changes
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuestionManagement;
