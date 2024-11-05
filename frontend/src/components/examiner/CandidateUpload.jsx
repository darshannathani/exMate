import React, { useState } from 'react';
import { examinerService } from '../../api/services/examinerService';
import { useTheme } from '../../contexts/ThemeContext';

const CandidateUpload = () => {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { isDarkMode } = useTheme();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
        setError('');
        setSuccess('');
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            setError('Please select a file');
            return;
        }

        try {
            setUploading(true);
            const result = await examinerService.uploadCandidates(file);
            setSuccess(`Successfully uploaded ${result.length} candidates`);
            setFile(null);
        } catch (error) {
            setError(error.response?.data || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className={`max-w-md mx-auto mt-8 p-6 rounded shadow ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-black'}`}>
            <h2 className="text-2xl font-bold mb-4">Upload Candidates</h2>
            {error && <div className="text-red-500 mb-4">{error}</div>}
            {success && <div className="text-green-500 mb-4">{success}</div>}
            <form onSubmit={handleUpload}>
                <div className="mb-4">
                    <label className="block mb-2">Excel File</label>
                    <input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                        className="w-full p-2 border rounded"
                    />
                </div>
                <button
                    type="submit"
                    disabled={uploading || !file}
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                >
                    {uploading ? 'Uploading...' : 'Upload Candidates'}
                </button>
            </form>
        </div>
    );
};

export default CandidateUpload;
