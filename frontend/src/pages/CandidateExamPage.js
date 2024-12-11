import { useParams } from 'react-router-dom';
import ExamPage from '../components/candidate/ExamPage';

const CandidateExamPage = () => {
    const { exam_id } = useParams();
    console.log(exam_id);
    return <ExamPage examId={exam_id} />;
};

export default CandidateExamPage;