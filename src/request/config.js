export default {
    method: 'get',
    baseURL: 'http://localhost:8001',
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    },
    timeout: 10000,
    withCredentials: true,
    responseType: 'json'
}