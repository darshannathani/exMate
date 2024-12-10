import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const FullScreenHandler = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const enterFullScreen = () => {
            const docElm = document.documentElement;
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            } else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            } else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            } else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        };
        const handleBeforeUnload = (e) => {
            e.preventDefault();
            e.returnValue = '';
        };

        const handleVisibilityChange = () => {
            if (document.visibilityState === 'hidden') {
                navigate('/candidate/available-exams');
            }
        };
        const blockDevTools = (e) => {
            if (e.keyCode === 123 ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 73) ||
                (e.ctrlKey && e.shiftKey && e.keyCode === 74)
            ) {
                e.preventDefault();
            }
        };
        enterFullScreen();
        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('visibilitychange', handleVisibilityChange);
        document.addEventListener('keydown', blockDevTools);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
            document.removeEventListener('keydown', blockDevTools);
        };
    }, [navigate]);

    return <>{children}</>;
};

FullScreenHandler.propTypes = {
    children: PropTypes.node.isRequired
};

export default FullScreenHandler;