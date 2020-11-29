// Import all functions from put-item.js 
const lambda = require('../../../src/handlers/put-season.js');
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb');

// This includes all tests for putItemHandler() 
describe('Test putSeasonHandler', function () {
    let putSpy; 
 
    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => { 
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        putSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'put'); 
    }); 
 
    // Clean up mocks 
    afterAll(() => { 
        putSpy.mockRestore(); 
    }); 
 
    // This test invokes putItemHandler() and compare the result  
    it('should add id to the table', async () => {
        const returnedItem = {
            species: 'deer',
            subspecies: 'whitetail',
            antlered: true,
            controlled: false,
            regionId: '12-11-01',
            seasonStart: '11-01-2020',
            seasonEnd: '11-15-2020',
            weaponType: 'archery_only'
        };
 
        // Return the specified value whenever the spied put function is called 
        putSpy.mockReturnValue({ 
            promise: () => Promise.resolve(returnedItem) 
        }); 
 
        const event = { 
            httpMethod: 'POST', 
            body: '{"species":"deer","subspecies":"whitetail","antlered":true,"controlled":false,"regionId":"12-11-01","seasonStart":"11-01-2020","seasonEnd":"11-15-2020","weaponType":"archery_only"}'
        }; 
     
        // Invoke putItemHandler() 
        const result = await lambda.putSeasonHandler(event);
        const expectedResult = { 
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Methods": "OPTIONS,POST",
            },
            body: JSON.stringify(returnedItem) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
 