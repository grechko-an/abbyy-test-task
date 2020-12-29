const config = require('../configuration/config.json');
let request = require('supertest');
let expected = require('../testData/expectedData.json');
let input = require('../testData/inputData.json');

describe('Test lookup API method', () => {

    it('Should return status code 200 and correct response when set mandatory parameters with valid API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.validAPIKey.key}&lang=${input.validLangDirectionCode.code}&text=${input.validText.text}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expected.lookupResponse);
    });

    it('Should return status code 200 and correct response when set non-mandatory and mandatory parameters with valid API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.validAPIKey.key}&lang=${input.validLangDirectionCode.code}&text=${input.validText.text}&ui=${input.validUi.ui}&flag=${input.validFlag.flag}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(200);
        expect(response.body).toMatchObject(expected.lookupResponseWithNonMandatoryParams);
    });

    it('Should return code 401 and correct error message when set mandatory parameters with invalid API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.invalidAPIKey.key}&lang=${input.validLangDirectionCode.code}&text=${input.validText.text}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(403);
        expect(response.body).toMatchObject(expected.invalidKeyResponse);
    });

    it('Should return code 402 and correct error message when set mandatory parameters with blocked API key', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.blockedAPIKey.key}&lang=${input.validLangDirectionCode.code}&text=${input.validText.text}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(403);
        expect(response.body).toMatchObject(expected.blockedKeyResponse);
    });

    it('Should return code 502 and correct error message without "lang" mandatory parameter', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.validAPIKey.key}&text=${input.validText.text}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject(expected.invalidLangParameterResponse);
    });

    it('Should return code 502 and correct error message without "text" mandatory parameter', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.validAPIKey.key}&lang=${input.validLangDirectionCode.code}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject(expected.invalidTextParameterResponse);
    });

    it('Should returns code 413 and correct error message once maximum text size is exceeded', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.validAPIKey.key}&lang=${input.validLangDirectionCode.code}&text=${input.overlimitedText.text}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(413);
        expect(response.body).toMatchObject(expected.overlimitedTextResponse);
    });

    it('Should returns code 501 and correct error message once specified translation direction is not supported', async() => {
        const response = await request(config.baseURL).get(`/api/v1/dicservice.json/lookup?key=${input.validAPIKey.key}&lang=${input.invalidLangDirectionCode.code}&text=${input.validText.text}`)
            .set('Content-Type', 'application/json');
        expect(response.statusCode).toBe(400);
        expect(response.body).toMatchObject(expected.invalidLangDirectionResponse);
    });

    // Did not find info about daily limits 
    xit('Should return code 403 and correct error message once daily requests limit is exceeded', async() => {});

});