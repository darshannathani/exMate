import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Container, Typography, Paper, Button, Box, Dialog, DialogTitle,
    DialogContent, DialogActions, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, TextField, IconButton,
    Select, MenuItem, FormControl, InputLabel, Tabs, Tab
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { questionService } from '../../api/services/questionService';

const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index} role="tabpanel">
        {value === index && <Box>{children}</Box>}
    </div>
);

const QuestionTab = ({ data, onChange }) => (
    <Box>
        <TextField
            label="Question Text"
            fullWidth
            margin="normal"
            value={data.text}
            onChange={(e) => onChange('text', e.target.value)}
        />
        <FormControl fullWidth margin="normal">
            <InputLabel>Section Type</InputLabel>
            <Select
                value={data.section_type}
                onChange={(e) => onChange('section_type', e.target.value)}
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
                onChange={(e) => onChange('difficulty', e.target.value)}
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
            onChange={(e) => onChange('image', e.target.value)}
        />
        <TextField
            label="Marks"
            type="number"
            fullWidth
            margin="normal"
            value={data.marks}
            onChange={(e) => onChange('marks', parseInt(e.target.value) || 0)}
        />
    </Box>
);

const OptionsTab = ({ options = [], onOptionChange }) => (
    <Box>
        {(options || []).map((option, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #ddd', borderRadius: 1 }}>
                <Typography variant="subtitle1">Option {index + 1}</Typography>
                <TextField
                    label="Option Text"
                    fullWidth
                    margin="normal"
                    value={option.option_text || ''}
                    onChange={(e) => onOptionChange(index, 'option_text', e.target.value)}
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Is Correct</InputLabel>
                    <Select
                        value={option.is_correct || 'false'}
                        onChange={(e) => onOptionChange(index, 'is_correct', e.target.value)}
                    >
                        <MenuItem value="true">Yes</MenuItem>
                        <MenuItem value="false">No</MenuItem>
                    </Select>
                </FormControl>
                <TextField
                    label="Option Image URL"
                    fullWidth
                    margin="normal"
                    value={option.image || ''}
                    onChange={(e) => onOptionChange(index, 'image', e.target.value)}
                />
            </Box>
        ))}
        <Button 
            sx={{ mt: 3 }}
            variant="contained" 
            color="primary"
            onClick={() => onOptionChange(options.length, 'add', {
                option_text: '',
                is_correct: 'false',
                image: ''
            })}
        >
            Add Option
        </Button>
    </Box>
);

const QuestionForm = ({ data, onChange, onOptionChange, currentTab, handleTabChange }) => (
    <Box>
        <Tabs value={currentTab} onChange={handleTabChange}>
            <Tab label="Question Details" />
            <Tab label="Options" disabled={data.section_type === 'PROGRAMMING'} />
        </Tabs>
        <TabPanel value={currentTab} index={0}>
            <QuestionTab data={data} onChange={onChange} />
        </TabPanel>
        <TabPanel value={currentTab} index={1}>
            <OptionsTab options={data.options} onOptionChange={onOptionChange} />
        </TabPanel>
    </Box>
);

const QuestionManagement = () => {
    let a = 1;
    const [questions, setQuestions] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [currentTab, setCurrentTab] = useState(0);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedQuestionId, setSelectedQuestionId] = useState(null);

    const emptyQuestion = {
        text: '',
        section_type: 'LOGICAL',
        difficulty: 'Easy',
        image: '',
        marks: 1,
        options: [],
    };

    const [newQuestion, setNewQuestion] = useState(emptyQuestion);

    useEffect(() => {
        fetchQuestions();
    }, []);

    const isValidOption = (option) => {
        return option && 
               option.option_text && 
               option.option_text.trim() !== '' && 
               option.is_correct !== undefined;
    };

    const getValidOptions = (options) => {
        return (options || []).filter(isValidOption);
    };

    const fetchQuestions = async () => {
        try {
            const questions = await questionService.getAllQuestions();
            setQuestions(questions);
        } catch (error) {
            console.error('Error fetching questions:', error);
            alert('Failed to fetch questions.');
        }
    };

    const handleTabChange = (_, newValue) => setCurrentTab(newValue);

    const handleFieldChange = (field, value) => {
        setNewQuestion((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleOptionChange = (index, field, value) => {
        setNewQuestion((prev) => {
            const updatedOptions = [...(prev.options || [])];
            if (field === 'add') {
                updatedOptions.push(value);
            } else {
                updatedOptions[index] = {
                    ...updatedOptions[index],
                    [field]: value,
                    modified: true
                };
            }
            return { ...prev, options: updatedOptions };
        });
    };

    const handleAddQuestion = async () => {
        try {
            const questionData = {
                text: newQuestion.text,
                section_type: newQuestion.section_type,
                difficulty: newQuestion.difficulty,
                image: newQuestion.image,
                marks: newQuestion.marks
            };
            const validOptions = getValidOptions(newQuestion.options);
            const hasValidOptions = validOptions.length > 0 && 
                                  newQuestion.section_type !== 'PROGRAMMING';
            const addedQuestion = await questionService.addQuestion(questionData);
            if (hasValidOptions) {
                for (const option of validOptions) {
                    await questionService.addOption(addedQuestion.question_id, option);
                }
            }

            setDialogOpen(false);
            setNewQuestion(emptyQuestion);
            fetchQuestions();
            alert('Question added successfully!');
        } catch (error) {
            console.error('Failed to add question:', error);
            alert('Failed to add question');
        }
    };

    const handleEditClick = async (questionId) => {
        try {
            const questionData = await questionService.getQuestionById(questionId);
            const optionsData = await questionService.getOptionsByQuestionId(questionId);
            if (!optionsData) {
                setNewQuestion(questionData);
            }
            else{
                setNewQuestion({
                    ...questionData,
                    options: Array.isArray(optionsData) ? optionsData : [optionsData]
                });
            }
            
            setIsEditing(true);
            setSelectedQuestionId(questionId);
            setDialogOpen(true);
        } catch (error) {
            console.error('Failed to fetch question details:', error);
            alert('Failed to load question details');
        }
        finally{
            fetchQuestions();
        }
    };

    const handleUpdateQuestion = async () => {
        try {
            const questionData = {
                text: newQuestion.text,
                section_type: newQuestion.section_type,
                difficulty: newQuestion.difficulty,
                image: newQuestion.image,
                marks: newQuestion.marks
            };
            await questionService.updateQuestion(selectedQuestionId, questionData);
            const validOptions = getValidOptions(newQuestion.options);
            const hasValidOptions = validOptions.length > 0 && newQuestion.section_type !== 'PROGRAMMING';
            if (hasValidOptions) {
                const existingOptions = await questionService.getOptionsByQuestionId(selectedQuestionId);
                const existingOptionsMap = new Map(
                    existingOptions ? existingOptions.map(opt => [opt.option_id, opt]) : []
                );
                for (const option of validOptions) {
                    if (option.option_id) {
                        const existingOption = existingOptionsMap.get(option.option_id);
                        const hasChanged = existingOption && (
                            existingOption.option_text !== option.option_text ||
                            existingOption.is_correct !== option.is_correct ||
                            existingOption.image !== option.image
                        );
                        if (hasChanged) {
                            await questionService.updateOption(option.option_id, option);
                        }
                    } else {
                        await questionService.addOption(selectedQuestionId, option);
                    }
                }
                if (existingOptions) {
                    const currentValidOptionIds = new Set(
                        validOptions
                            .filter(opt => opt.option_id)
                            .map(opt => opt.option_id)
                    );
                    for (const existingOption of existingOptions) {
                        if (!currentValidOptionIds.has(existingOption.option_id)) {
                            await questionService.deleteOption(existingOption.option_id);
                        }
                    }
                }
            }

            setDialogOpen(false);
            setNewQuestion(emptyQuestion);
            setIsEditing(false);
            setSelectedQuestionId(null);
            fetchQuestions();
            alert('Question updated successfully!');
        } catch (error) {
            console.error('Failed to update question:', error);
            alert('Failed to update question');
        }
    };

    const handleDeleteQuestion = async (questionId) => {
        if (window.confirm('Are you sure you want to delete this question?')) {
            try {
                await questionService.deleteQuestion(questionId);
                fetchQuestions();
                alert('Question deleted successfully!');
            } catch (error) {
                console.error('Failed to delete question:', error);
                alert('Failed to delete question');
            }
            finally{
                fetchQuestions();
            }
        }
        
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setNewQuestion(emptyQuestion);
        setIsEditing(false);
        setSelectedQuestionId(null);
        setCurrentTab(0);
    };

    const handleSaveClick = () => {
        const validOptions = getValidOptions(newQuestion.options);
        if (newQuestion.section_type !== 'PROGRAMMING' && validOptions.length === 0) {
            alert('Please add at least one valid option with option text');
            return;
        }
        
        if (isEditing) {
            handleUpdateQuestion();
        } else {
            handleAddQuestion();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>Question Management</Typography>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={() => setDialogOpen(true)}
                    sx={{ mb: 3 }}
                >
                    Add Question
                </Button>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Question</TableCell>
                                <TableCell>Section Type</TableCell>
                                <TableCell>Difficulty</TableCell>
                                <TableCell>Marks</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {questions.map((question) => (
                                <TableRow key={question.question_id}>
                                    <TableCell>{a++}</TableCell>
                                    <TableCell>{question.text}</TableCell>
                                    <TableCell>{question.section_type}</TableCell>
                                    <TableCell>{question.difficulty}</TableCell>
                                    <TableCell>{question.marks}</TableCell>
                                    <TableCell>
                                        <IconButton 
                                            color="primary"
                                            onClick={() => handleEditClick(question.question_id)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton 
                                            color="error"
                                            onClick={() => handleDeleteQuestion(question.question_id)}
                                        >
                                            <DeleteIcon />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>

            <Dialog open={dialogOpen} onClose={handleDialogClose} maxWidth="md" fullWidth>
                <DialogTitle>{isEditing ? 'Edit Question' : 'Add Question'}</DialogTitle>
                <DialogContent>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={currentTab} onChange={handleTabChange}>
                            <Tab label="Details" />
                            <Tab label="Options" disabled={newQuestion.section_type === 'PROGRAMMING'} />
                        </Tabs> 
                    </Box>
                    <TabPanel value={currentTab} index={0}>
                        <QuestionTab data={newQuestion} onChange={handleFieldChange} />
                    </TabPanel>
                    <TabPanel value={currentTab} index={1}>
                        <OptionsTab options={newQuestion.options} onOptionChange={handleOptionChange} />
                    </TabPanel>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleDialogClose}>Cancel</Button>
                    <Button 
                        onClick={handleSaveClick}
                        variant="contained" 
                        color="primary"
                    >
                        {isEditing ? 'Update' : 'Save'}
                    </Button>
                </DialogActions>
            </Dialog>

            
        </Container>
    );
};

TabPanel.propTypes = {
    children: PropTypes.node,
    value: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
};

QuestionTab.propTypes = {
    data: PropTypes.shape({
        text: PropTypes.string.isRequired,
        section_type: PropTypes.oneOf(['LOGICAL', 'TECHNICAL', 'PROGRAMMING']).isRequired,
        difficulty: PropTypes.oneOf(['Easy', 'Medium', 'Hard']).isRequired,
        image: PropTypes.string,
        marks: PropTypes.number.isRequired,
    }).isRequired,
    onChange: PropTypes.func.isRequired,
};

OptionsTab.propTypes = {
    options: PropTypes.arrayOf(
        PropTypes.shape({
            option_text: PropTypes.string.isRequired,
            is_correct: PropTypes.oneOf(['true', 'false']).isRequired,
            image: PropTypes.string,
        })
    ).isRequired,
    onOptionChange: PropTypes.func.isRequired,
};

QuestionForm.propTypes = {
    data: PropTypes.shape({
        text: PropTypes.string,
        section_type: PropTypes.string,
        difficulty: PropTypes.string,
        image: PropTypes.string,
        marks: PropTypes.number,
        options: PropTypes.arrayOf(
            PropTypes.shape({
                option_text: PropTypes.string,
                is_correct: PropTypes.string,
                image: PropTypes.string,
            })
        ),
    }).isRequired,
    isEdit: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    onOptionChange: PropTypes.func.isRequired,
    currentTab: PropTypes.number.isRequired,
    handleTabChange: PropTypes.func.isRequired,
};


export default QuestionManagement;