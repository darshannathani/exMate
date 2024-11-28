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
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Menu,
    Tooltip,
    IconButton,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Tabs,
    Tab,
} from '@mui/material';
import { 
    Edit as EditIcon, 
    Delete as DeleteIcon, 
    Search as SearchIcon,
    FilterList as FilterListIcon,
    Sort as SortIcon,
    Visibility as VisibilityIcon
} from '@mui/icons-material';
import { examService } from '../../api/services/examService';
const ExamManagement = () => {
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [selectedExam, setSelectedExam] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [anchorElFilter, setAnchorElFilter] = useState(null);
    const [anchorElSort, setAnchorElSort] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({
        difficulty: '',
        status: ''
    });
    const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
    const [examQuestions, setExamQuestions] = useState([]);
    const [tabValue, setTabValue] = useState(0);
    const [sortCriteria, setSortCriteria] = useState({
        field: 'title',
        direction: 'asc'
    });
    const handleViewExamDetails = async (exam) => {
        setSelectedExam(exam);
        
        try {
            const questions = await examService.getQuestionsByExam(exam.exam_id);
            setExamQuestions(questions);
            setDetailsDialogOpen(true);
        } catch (error) {
            console.error('Failed to fetch exam questions', error);
            alert('Failed to fetch exam questions.');
        }
    };
    const [newExam, setNewExam] = useState({
        title: '',
        description: '',
        passing_score: 0,
        status: 'ACTIVE',
        difficulty: 'Easy',
        mcq: 0,
        programming: 0,
        db: 0,
        Total_marks: 0,
        duration: 0,
        start_date: '',
        end_date: ''
    });

    const fetchExams = async () => {
        try {
            const response = await examService.getAllExams();
            setExams(response);
            setFilteredExams(response);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            alert('Failed to fetch exams.');
        }
    };

    useEffect(() => {
        fetchExams();
    }, []);

    useEffect(() => {
        let result = exams;

        if (searchTerm) {
            result = result.filter(exam => 
                exam.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (filterCriteria.difficulty) {
            result = result.filter(exam => 
                exam.difficulty === filterCriteria.difficulty
            );
        }

        if (filterCriteria.status) {
            result = result.filter(exam => 
                exam.status === filterCriteria.status
            );
        }

        result.sort((a, b) => {
            const field = sortCriteria.field;
            if (a[field] < b[field]) return sortCriteria.direction === 'asc' ? -1 : 1;
            if (a[field] > b[field]) return sortCriteria.direction === 'asc' ? 1 : -1;
            return 0;
        });

        setFilteredExams(result);
    }, [searchTerm, filterCriteria, sortCriteria, exams]);

    const handleAddExam = async () => {
        try {
            const examData = {
                ...newExam,
                start_date: newExam.start_date ? new Date(newExam.start_date).toISOString() : null,
                end_date: newExam.end_date ? new Date(newExam.end_date).toISOString() : null
            };
            console.log(examData);
            await examService.createExam(examData);
            alert('Exam created successfully!');
    
            setNewExam({
                title: '',
                description: '',
                passing_score: 0,
                status: 'ACTIVE',
                difficulty: 'Easy',
                mcq: 0,
                programming: 0,
                db: 0,
                Total_marks: 0,
                duration: 0,
                start_date: '',
                end_date: ''
            });
            setDialogOpen(false);
    
            await fetchExams();
        } catch (error) {
            console.error('Error adding exam:', error);
            alert('Failed to add exam.');
        }
    };

    const handleEditExam = (exam) => {
        setSelectedExam({...exam});
        setEditDialogOpen(true);
    };

    const handleUpdateExam = async () => {
        try {
            const examData = {
                ...selectedExam,
                start_date: selectedExam.start_date ? new Date(selectedExam.start_date).toISOString() : null,
                end_date: selectedExam.end_date ? new Date(selectedExam.end_date).toISOString() : null
            };

            await examService.updateExam(selectedExam.exam_id, examData);
            alert('Exam updated successfully!');
    
            setEditDialogOpen(false);
            setSelectedExam(null);
    

            await fetchExams();
        } catch (error) {
            console.error('Error updating exam:', error);
            alert('Failed to update exam.');
        }
    };

    const handleDeleteExam = async (exam_id) => {
        if (window.confirm('Are you sure you want to delete this exam?')) {
            try {
                await examService.deleteExam(exam_id);
                alert('Exam deleted successfully!');
                await fetchExams();
            } catch (error) {
                console.error('Error deleting exam:', error);
                alert('Failed to delete exam.');
            }
        }
    };
    const handleRegenerateQuestions = async () => {
        try {
            const regeneratedQuestions = await examService.regenerateQuestions(selectedExam.exam_id);
            setExamQuestions(regeneratedQuestions);
            alert('Questions regenerated successfully!');
        } catch (error) {
            console.error('Failed to regenerate questions', error);
            alert('Failed to regenerate questions.');
        }
    };
    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
            Exam Management
        </Typography>
        <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                mb: 2 
            }}>
                <Typography variant="h6">Exam List</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => setDialogOpen(true)}
                >
                    Add Exam
                </Button>
            </Box>
            
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2 
            }}>
                <TextField
                    variant="outlined"
                    placeholder="Search Exams"
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: <SearchIcon sx={{ mr: 1, color: 'grey.500' }} />
                    }}
                    sx={{ mr: 2 }}
                />
                
                <Tooltip title="Filter">
                    <IconButton 
                        onClick={(e) => setAnchorElFilter(e.currentTarget)}
                        sx={{ mr: 1 }}
                    >
                        <FilterListIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorElFilter}
                    open={Boolean(anchorElFilter)}
                    onClose={() => setAnchorElFilter(null)}
                >
                    <MenuItem>
                        <FormControl fullWidth>
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                                value={filterCriteria.difficulty}
                                label="Difficulty"
                                onChange={(e) => setFilterCriteria(prev => ({
                                    ...prev, 
                                    difficulty: e.target.value
                                }))}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                    <MenuItem>
                        <FormControl fullWidth>
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={filterCriteria.status}
                                label="Status"
                                onChange={(e) => setFilterCriteria(prev => ({
                                    ...prev, 
                                    status: e.target.value
                                }))}
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="INACTIVE">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                </Menu>
                
                <Tooltip title="Sort">
                    <IconButton 
                        onClick={(e) => setAnchorElSort(e.currentTarget)}
                    >
                        <SortIcon />
                    </IconButton>
                </Tooltip>
                <Menu
                    anchorEl={anchorElSort}
                    open={Boolean(anchorElSort)}
                    onClose={() => setAnchorElSort(null)}
                >
                    <MenuItem>
                        <FormControl fullWidth>
                            <InputLabel>Sort By</InputLabel>
                            <Select
                                value={sortCriteria.field}
                                label="Sort By"
                                onChange={(e) => setSortCriteria(prev => ({
                                    ...prev, 
                                    field: e.target.value
                                }))}
                            >
                                <MenuItem value="title">Title</MenuItem>
                                <MenuItem value="Total_marks">Total Marks</MenuItem>
                                <MenuItem value="difficulty">Difficulty</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                    <MenuItem>
                        <FormControl fullWidth>
                            <InputLabel>Direction</InputLabel>
                            <Select
                                value={sortCriteria.direction}
                                label="Direction"
                                onChange={(e) => setSortCriteria(prev => ({
                                    ...prev, 
                                    direction: e.target.value
                                }))}
                            >
                                <MenuItem value="asc">Ascending</MenuItem>
                                <MenuItem value="desc">Descending</MenuItem>
                            </Select>
                        </FormControl>
                    </MenuItem>
                </Menu>
            </Box>

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Difficulty</TableCell>
                            <TableCell>Total Marks</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredExams.map((exam) => (
                            <TableRow key={exam.exam_id}>
                                <TableCell>{exam.exam_id}</TableCell>
                                <TableCell>{exam.title}</TableCell>
                                <TableCell>{exam.difficulty}</TableCell>
                                <TableCell>{exam.Total_marks}</TableCell>
                                <TableCell>{exam.status}</TableCell>
                                <TableCell>
                                    <Tooltip title="View Details">
                                        <IconButton
                                            onClick={() => handleViewExamDetails(exam)}
                                            sx={{ color: '#1976d2' }}
                                        >
                                            <VisibilityIcon />
                                        </IconButton>
                                    </Tooltip>
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

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Add New Exam</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Title"
                        fullWidth
                        margin="normal"
                        value={newExam.title}
                        onChange={(e) => setNewExam(prev => ({ ...prev, title: e.target.value }))}
                        required
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        margin="normal"
                        multiline
                        rows={3}
                        value={newExam.description}
                        onChange={(e) => setNewExam(prev => ({ ...prev, description: e.target.value }))}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Passing Score"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={newExam.passing_score}
                            onChange={(e) => setNewExam(prev => ({ ...prev, passing_score: Number(e.target.value) }))}
                        />
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Status</InputLabel>
                            <Select
                                value={newExam.status}
                                label="Status"
                                onChange={(e) => setNewExam(prev => ({ ...prev, status: e.target.value }))}
                            >
                                <MenuItem value="ACTIVE">Active</MenuItem>
                                <MenuItem value="INACTIVE">Inactive</MenuItem>
                            </Select>
                        </FormControl>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <FormControl fullWidth margin="normal">
                            <InputLabel>Difficulty</InputLabel>
                            <Select
                                value={newExam.difficulty}
                                label="Difficulty"
                                onChange={(e) => setNewExam(prev => ({ ...prev, difficulty: e.target.value }))}
                            >
                                <MenuItem value="Easy">Easy</MenuItem>
                                <MenuItem value="Medium">Medium</MenuItem>
                                <MenuItem value="Hard">Hard</MenuItem>
                            </Select>
                        </FormControl>
                        <TextField
                            label="Total Marks"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={newExam.Total_marks}
                            onChange={(e) => setNewExam(prev => ({ ...prev, Total_marks: Number(e.target.value) }))}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="MCQ Questions"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={newExam.mcq}
                            onChange={(e) => setNewExam(prev => ({ ...prev, mcq: Number(e.target.value) }))}
                        />
                        <TextField
                            label="Programming Questions"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={newExam.programming}
                            onChange={(e) => setNewExam(prev => ({ ...prev, programming: Number(e.target.value) }))}
                        />
                        <TextField
                            label="Database Questions"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={newExam.db}
                            onChange={(e) => setNewExam(prev => ({ ...prev, db: Number(e.target.value) }))}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Duration (minutes)"
                            type="number"
                            fullWidth
                            margin="normal"
                            value={newExam.duration}
                            onChange={(e) => setNewExam(prev => ({ ...prev, duration: Number(e.target.value) }))}
                        />
                    </Box>
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Start Date"
                            type="datetime-local"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={newExam.start_date}
                            onChange={(e) => setNewExam(prev => ({ ...prev, start_date: e.target.value }))}
                        />
                        <TextField
                            label="End Date"
                            type="datetime-local"
                            fullWidth
                            margin="normal"
                            InputLabelProps={{ shrink: true }}
                            value={newExam.end_date}
                            onChange={(e) => setNewExam(prev => ({ ...prev, end_date: e.target.value }))}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleAddExam} color="primary" variant="contained">
                        Add Exam
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog 
                    open={detailsDialogOpen} 
                    onClose={() => setDetailsDialogOpen(false)} 
                    fullWidth 
                    maxWidth="lg"
                >
                <DialogTitle>Exam Details</DialogTitle>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={(e, newValue) => setTabValue(newValue)}
                    >
                        <Tab label="Exam Details" />
                        <Tab label="Questions" />
                    </Tabs>
                </Box>
                <DialogContent>
                    {tabValue === 0 && selectedExam && (
                        <Box>
                            <Typography variant="h6">Exam Information</Typography>
                            <Typography>Title: {selectedExam.title}</Typography>
                            <Typography>Description: {selectedExam.description}</Typography>
                            <Typography>Difficulty: {selectedExam.difficulty}</Typography>
                            <Typography>Status: {selectedExam.status}</Typography>
                            <Typography>Passing Score: {selectedExam.passing_score}</Typography>
                            <Typography>Total Marks: {selectedExam.Total_marks}</Typography>
                            <Typography>Duration: {selectedExam.duration} minutes</Typography>
                            <Typography>Start Date: {selectedExam.start_date}</Typography>
                            <Typography>End Date: {selectedExam.end_date}</Typography>
                            </Box>
                            )}
            {tabValue === 1 && (
                            <Box>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    onClick={handleRegenerateQuestions}
                                    sx={{ mb: 2 }}
                                >
                                    Regenerate Questions
                                </Button>
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell>Question ID</TableCell>
                                                <TableCell>Type</TableCell>
                                                <TableCell>Marks</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {examQuestions.map((question) => (
                                                <TableRow key={question.question_id}>
                                                    <TableCell>{question.question_id}</TableCell>
                                                    <TableCell>{question.type}</TableCell>
                                                    <TableCell>{question.marks}</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Box>
                        )}
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setDetailsDialogOpen(false)} color="secondary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Edit Exam</DialogTitle>
                <DialogContent>
                    {selectedExam && (
                        <>
                            <TextField
                                label="Title"
                                fullWidth
                                margin="normal"
                                value={selectedExam.title}
                                onChange={(e) => setSelectedExam(prev => ({ ...prev, title: e.target.value }))}
                                required
                            />
                            <TextField
                                label="Description"
                                fullWidth
                                margin="normal"
                                multiline
                                rows={3}
                                value={selectedExam.description}
                                onChange={(e) => setSelectedExam(prev => ({ ...prev, description: e.target.value }))}
                            />
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Passing Score"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={selectedExam.passing_score}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, passing_score: Number(e.target.value) }))}
                                />
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Status</InputLabel>
                                    <Select
                                        value={selectedExam.status}
                                        label="Status"
                                        onChange={(e) => setSelectedExam(prev => ({ ...prev, status: e.target.value }))}
                                    >
                                        <MenuItem value="ACTIVE">Active</MenuItem>
                                        <MenuItem value="INACTIVE">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel>Difficulty</InputLabel>
                                    <Select
                                        value={selectedExam.difficulty}
                                        label="Difficulty"
                                        onChange={(e) => setSelectedExam(prev => ({ ...prev, difficulty: e.target.value }))}
                                    >
                                        <MenuItem value="Easy">Easy</MenuItem>
                                        <MenuItem value="Medium">Medium</MenuItem>
                                        <MenuItem value="Hard">Hard</MenuItem>
                                    </Select>
                                </FormControl>
                                <TextField
                                    label="Total Marks"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={selectedExam.Total_marks}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, Total_marks: Number(e.target.value) }))}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="MCQ Questions"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={selectedExam.mcq}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, mcq: Number(e.target.value) }))}
                                />
                                <TextField
                                    label="Programming Questions"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={selectedExam.programming}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, programming: Number(e.target.value) }))}
                                />
                                <TextField
                                    label="Database Questions"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={selectedExam.db}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, db: Number(e.target.value) }))}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Duration (minutes)"
                                    type="number"
                                    fullWidth
                                    margin="normal"
                                    value={selectedExam.duration}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, duration: Number(e.target.value) }))}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <TextField
                                    label="Start Date"
                                    type="datetime-local"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    value={selectedExam.start_date}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, start_date: e.target.value }))}
                                />
                                <TextField
                                    label="End Date"
                                    type="datetime-local"
                                    fullWidth
                                    margin="normal"
                                    InputLabelProps={{ shrink: true }}
                                    value={selectedExam.end_date}
                                    onChange={(e) => setSelectedExam(prev => ({ ...prev, end_date: e.target.value }))}
                                />
                            </Box>
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditDialogOpen(false)} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateExam} color="primary" variant="contained">
                        Update Exam
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default ExamManagement;
