import { useState, useEffect } from 'react';
import {
    Container, Typography, Paper, Button, Box, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, IconButton,
    Tooltip, Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { questionService } from '../../api/services/questionService';

const QuestionManagement = () => {
    const [questions, setQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    
    const emptyQuestion = {
        text: '',
        section_type: 'LOGICAL',
        difficulty: 'Easy',
        image: '',
        marks: 1,
        // category: '',
        options: [
            { option_text: '', is_correct: 'false', image: '' },
            { option_text: '', is_correct: 'false', image: '' },
            { option_text: '', is_correct: 'false', image: '' },
            { option_text: '', is_correct: 'false', image: '' }
        ]
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
            // First add the question
            const questionResponse = await questionService.addQuestion({
                text: newQuestion.text,
                section_type: newQuestion.section_type,
                difficulty: newQuestion.difficulty,
                image: newQuestion.image,
                marks: newQuestion.marks,
                // category: newQuestion.category
            });

            // Then add options for the question
            const questionId = questionResponse.question_id;
            for (const option of newQuestion.options) {
                await questionService.addOption(questionId, option);
            }

            alert('Question and options added successfully!');
            setNewQuestion(emptyQuestion);
            setDialogOpen(false);
            await fetchQuestions();
        } catch (error) {
            console.error('Error adding question:', error);
            alert('Failed to add question.');
        }
    };

    const handleEditClick = async (question) => {
        try {
            // Fetch options for the question
            const options = await questionService.getOptionsByQuestionId(question.question_id);
            setEditingQuestion({ ...question, options });
            setEditDialogOpen(true);
        } catch (error) {
            console.error('Error fetching options:', error);
            alert('Failed to fetch options.');
        }
    };

    const handleEditSave = async () => {
        try {
            // Update the question first
            await questionService.updateQuestion(editingQuestion.question_id, {
                text: editingQuestion.text,
                section_type: editingQuestion.section_type,
                difficulty: editingQuestion.difficulty,
                image: editingQuestion.image,
                marks: editingQuestion.marks,
                // category: editingQuestion.category
            });

            // Delete existing options and add new ones
            await questionService.deleteOptionsByQuestionId(editingQuestion.question_id);
            for (const option of editingQuestion.options) {
                await questionService.addOption(editingQuestion.question_id, option);
            }

            alert('Question and options updated successfully!');
            setEditDialogOpen(false);
            setEditingQuestion(null);
            await fetchQuestions();
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

    const QuestionForm = ({ data, setData, isEdit }) => (
        <>
            <TextField
                label="Question Text"
                fullWidth
                margin="normal"
                value={data.text}
                onChange={(e) => setData(prev => ({ ...prev, text: e.target.value }))}
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Section Type</InputLabel>
                <Select
                    value={data.section_type}
                    label="Section Type"
                    onChange={(e) => setData(prev => ({ ...prev, section_type: e.target.value }))}
                >
                    <MenuItem value="LOGICAL">Logical</MenuItem>
                    <MenuItem value="TECHNICAL">Technical</MenuItem>
                    <MenuItem value="PROGRAMMING">Programming</MenuItem>
                </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
                <InputLabel>Difficulty</InputLabel>
                <Select
                    value={data.difficulty}
                    label="Difficulty"
                    onChange={(e) => setData(prev => ({ ...prev, difficulty: e.target.value }))}
                >
                    <MenuItem value="Easy">Easy</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="Hard">Hard</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Image URL"
                fullWidth
                margin="normal"
                value={data.image}
                onChange={(e) => setData(prev => ({ ...prev, image: e.target.value }))}
            />
            <TextField
                label="Marks"
                type="number"
                fullWidth
                margin="normal"
                value={data.marks}
                onChange={(e) => setData(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
            />
            {/* <TextField
                label="Category"
                fullWidth
                margin="normal"
                value={data.category}
                onChange={(e) => setData(prev => ({ ...prev, category: e.target.value }))}
            /> */}
            
            <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>Options</Typography>
            {data.options.map((option, index) => (
                <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                    <Typography variant="subtitle1">Option {index + 1}</Typography>
                    <TextField
                        label="Option Text"
                        fullWidth
                        margin="normal"
                        value={option.option_text}
                        onChange={(e) => {
                            const newOptions = [...data.options];
                            newOptions[index] = { ...option, option_text: e.target.value };
                            setData(prev => ({ ...prev, options: newOptions }));
                        }}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Is Correct</InputLabel>
                        <Select
                            value={option.is_correct}
                            label="Is Correct"
                            onChange={(e) => {
                                const newOptions = [...data.options];
                                newOptions[index] = { ...option, is_correct: e.target.value };
                                setData(prev => ({ ...prev, options: newOptions }));
                            }}
                        >
                            <MenuItem value="true">Yes</MenuItem>
                            <MenuItem value="false">No</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label="Option Image URL"
                        fullWidth
                        margin="normal"
                        value={option.image}
                        onChange={(e) => {
                            const newOptions = [...data.options];
                            newOptions[index] = { ...option, image: e.target.value };
                            setData(prev => ({ ...prev, options: newOptions }));
                        }}
                    />
                </Box>
            ))}
        </>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Question Management</Typography>
            <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6">Question List</Typography>
                    <Button variant="contained" color="primary" onClick={() => setDialogOpen(true)}>
                        Add Question
                    </Button>
                </Box>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Type</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Marks</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question.question_id}>
                                    <TableCell>{question.question_id}</TableCell>
                                    <TableCell>{question.text}</TableCell>
                                    <TableCell>{question.section_type}</TableCell>
                                    <TableCell>{question.difficulty}</TableCell>
                                    <TableCell>{question.marks}</TableCell>
                                    <TableCell>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEditClick(question)} sx={{ color: '#FFD700' }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDeleteQuestion(question.question_id)} sx={{ color: '#FF0000' }}>
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

            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Add Question</DialogTitle>
                <DialogContent>
                    <QuestionForm data={newQuestion} setData={setNewQuestion} isEdit={false} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleAddQuestion} color="primary">Add Question</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Edit Question</DialogTitle>
                <DialogContent>
                    {editingQuestion && (
                        <QuestionForm data={editingQuestion} setData={setEditingQuestion} isEdit={true} />
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleEditSave} color="primary">Save Changes</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default QuestionManagement;