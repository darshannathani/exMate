import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    Box, 
    Container, 
    Typography, 
    Grid, 
    Card, 
    CardContent, 
    CardActions, 
    Button, 
    Chip, 
    TextField, 
    FormControl, 
    InputLabel, 
    Select, 
    MenuItem,
    CircularProgress,
    Alert
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import StarIcon from '@mui/icons-material/Star';
import { candidateService } from '../../api/services/candidateService';

const AvailableExamCards = () => {
    const navigate = useNavigate();
    const [exams, setExams] = useState([]);
    const [filteredExams, setFilteredExams] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState({
        difficulty: '',
        status: 'True'
    });
    const fetchAvailableExams = async () => {
        try {
            setIsLoading(true);
            const response = await candidateService.getAvailableExams();
            setExams(response);
            setFilteredExams(response);
            setIsLoading(false);
        } catch (error) {
            console.error('Failed to fetch exams', error);
            setError('Failed to fetch exams. Please try again later.');
            setIsLoading(false);
        }
    };
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
        setFilteredExams(result);
    }, [searchTerm, filterCriteria, exams]);
    useEffect(() => {
        fetchAvailableExams();
    }, []);
    const getDifficultyColor = (difficulty) => {
        switch (difficulty) {
            case 'Easy': return 'success';
            case 'Medium': return 'warning';
            case 'Hard': return 'error';
            default: return 'default';
        }
    };
    const handleStartExam = (exam) => {
        if (exam.status === 'True') {
            navigate(`/candidate/exam/${exam.exam_id}`);
        }
    };
    if (isLoading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Container maxWidth="md" sx={{ mt: 4 }}>
                <Alert severity="error">{error}</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Available Exams
            </Typography>
            <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 3,
                gap: 2
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
                />
                <FormControl sx={{ minWidth: 200 }}>
                    <InputLabel>Difficulty</InputLabel>
                    <Select
                        value={filterCriteria.difficulty}
                        label="Difficulty"
                        onChange={(e) => setFilterCriteria(prev => ({
                            ...prev, 
                            difficulty: e.target.value
                        }))}
                    >
                        <MenuItem value="">All Difficulties</MenuItem>
                        <MenuItem value="Easy">Easy</MenuItem>
                        <MenuItem value="Medium">Medium</MenuItem>
                        <MenuItem value="Hard">Hard</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            {filteredExams.length === 0 && (
                <Alert severity="info">No exams are currently available.</Alert>
            )}
            <Grid container spacing={3}>
                {filteredExams.map((exam) => (
                    <Grid item xs={12} sm={6} md={4} key={exam.exam_id}>
                        <Card 
                            variant="outlined"
                            sx={{ 
                                height: '100%', 
                                display: 'flex', 
                                flexDirection: 'column',
                                transition: 'transform 0.2s',
                                '&:hover': {
                                    transform: 'scale(1.05)'
                                }
                            }}
                        >
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'space-between', 
                                    alignItems: 'center',
                                    mb: 2 
                                }}>
                                    <Typography variant="h6" component="div">
                                        {exam.title}
                                    </Typography>
                                    <Chip 
                                        label={exam.difficulty} 
                                        color={getDifficultyColor(exam.difficulty)} 
                                        size="small" 
                                    />
                                </Box>
                                <Typography variant="body2" color="text.secondary" paragraph>
                                    {exam.description}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <AccessTimeIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        Duration: {exam.duration} minutes
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <QuestionMarkIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        Total Questions: {exam.mcq + exam.programming + exam.db}
                                    </Typography>
                                </Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                    <StarIcon fontSize="small" sx={{ mr: 1 }} />
                                    <Typography variant="body2">
                                        Passing Score: {exam.passing_score}%
                                    </Typography>
                                </Box>
                            </CardContent>
                            <CardActions sx={{ p: 2 }}>
                                <Button 
                                    variant="contained" 
                                    color="primary" 
                                    fullWidth
                                    onClick={() => handleStartExam(exam)}
                                    disabled={exam.status !== 'True'}
                                >
                                    {exam.status === 'True' ? 'Start Exam' : 'Exam Inactive'}
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};
export default AvailableExamCards;