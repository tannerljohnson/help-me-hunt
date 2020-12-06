// Import all functions from get-all-items.js 
const lambda = require('../../../src/handlers/get-all-seasons.js');
// Import dynamodb from aws-sdk 
const dynamodb = require('aws-sdk/clients/dynamodb'); 
 
// This includes all tests for getAllItemsHandler() 
describe('Test getAllSeasonsHandler', () => {
    let scanSpy; 
 
    // Test one-time setup and teardown, see more in https://jestjs.io/docs/en/setup-teardown 
    beforeAll(() => { 
        // Mock dynamodb get and put methods 
        // https://jestjs.io/docs/en/jest-object.html#jestspyonobject-methodname 
        scanSpy = jest.spyOn(dynamodb.DocumentClient.prototype, 'scan');
    }); 
 
    // Clean up mocks 
    afterAll(() => { 
        scanSpy.mockRestore(); 
    }); 
 
    it('should return ids', async () => { 
        const items = [{ id: 'id1', species: 'deer', state: 'Idaho' }, { id: 'id2', species: 'deer', state: 'Idaho' }];
 
        // Return the specified value whenever the spied scan function is called 
        scanSpy.mockReturnValue({ 
            promise: () => Promise.resolve({ Items: items }) 
        }); 
 
        const event = { 
            httpMethod: 'GET',
            queryStringParameters: { state: 'Idaho', species: 'deer' }
        };
 
        // Invoke helloFromLambdaHandler() 
        const result = await lambda.getAllSeasonsHandler(event);
 
        const expectedResult = { 
            statusCode: 200,
            headers: {
                "Access-Control-Allow-Origin": "*", // Required for CORS support to work
                "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
                "Access-Control-Allow-Methods": "OPTIONS,GET",
            },
            body: JSON.stringify(items) 
        }; 
 
        // Compare the result with the expected result 
        expect(result).toEqual(expectedResult); 
    }); 
}); 
