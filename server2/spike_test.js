import http from 'k6/http';

import { sleep } from 'k6';




export let options = {
    insecureSkipTLSVerify: true,
    noConnectionReuse: false,
    stages: [
        { duration: '1m', target: 100 },
        { duration: '10s', target: 400 },
        { duration: '2m', target: 400 },
        { duration: '3m', target: 100 },
        { duration: '10s', target: 0 },
    ],
};


const API_BASE_URL = 'http://localhost:5000';

export default () => {
    
    http.batch([
        ['GET', `${API_BASE_URL}/student/getallstudents`],
        ['GET', `${API_BASE_URL}/teacher/getallteachers`],
    ]);

    sleep(1);
};