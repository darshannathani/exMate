import { useParams } from 'react-router-dom';
import ExamPage from '../components/candidate/ExamPage';

const CandidateExamPage = () => {
    const { exam_id } = useParams();
    return <ExamPage examId={exam_id} />;
};

export default CandidateExamPage;