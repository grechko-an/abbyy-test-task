const config = require('../configuration/config.json');
let request = require('supertest');
let expected = require('../testData/expectedData.json');
let input = require('../testData/inputData.json');

describe('Test getLangs API method', () => {

    it('Should return status code 200 and correct response when set valid API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/getLangs?key=${input.validAPIKey.key}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expected.getLangsResponse.body);
    });

    it('Should return code 401 and correct error message when set invalid API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/getLangs?key=${input.invalidAPIKey.key}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(403);
        expect(response.body).toMatchObject(expected.invalidKeyResponse);
    });

    it('Should return code 402 and correct error message when set blocked API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/getLangs?key=${input.blockedAPIKey.key}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(403);
        expect(response.body).toMatchObject(expected.blockedKeyResponse);
    });

});