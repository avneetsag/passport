const dotenv = require('dotenv');
const axios = require('axios');
dotenv.config();
const { API_URL } = process.env;
test('test device array', () => {
    expect.assertions(1);
    return axios.get(`${API_URL}/devices`)
        .then(resp => resp.data)
        .then(resp => {
            console.log(resp[0]);
            expect(resp[0].user).toEqual('mary123');
        });
});
