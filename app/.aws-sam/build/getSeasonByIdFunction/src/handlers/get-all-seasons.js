// Create clients and set shared const values outside of the handler.

// Get the DynamoDB table name from environment variables
const tableName = process.env.SEASONS_TABLE;

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items from a DynamoDB table.
 */
exports.getAllSeasonsHandler = async (event) => {
    if (event.httpMethod !== 'GET') {
        throw new Error(`getAllItems only accept GET method, you tried: ${event.httpMethod}`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    const allowedSearchParams = ['species', 'state', 'youthOnly'];
    const sentSearchParams = Object.keys(event.queryStringParameters);
    if (sentSearchParams.filter(s => !allowedSearchParams.includes(s)).length > 0) {
        throw new Error(`received unknown query params: ${event.queryStringParameters}`);
    }

    const { species, state, youthOnly } = event.queryStringParameters;
    let attributeNames = {};
    let attributeValues = {};
    let filterExpression = [];

    if (species) {
        attributeNames['#species'] = 'species';
        attributeValues[':species'] = species;
        filterExpression.push('#species = :species');
    }
    if (state) {
        attributeNames['#state'] = 'state';
        attributeValues[':state'] = state;
        filterExpression.push('#state = :state');
    }
    if (youthOnly) {
        attributeNames['#youthOnly'] = 'youthOnly';
        attributeValues[':youthOnly'] = youthOnly === 'true';
        filterExpression.push('#youthOnly = :youthOnly');
    }

    filterExpression = filterExpression.join(' AND ');

    let params = {
        TableName: tableName,
    };

    if (!!filterExpression) {
        params.FilterExpression = filterExpression;
        params.ExpressionAttributeNames = attributeNames;
        params.ExpressionAttributeValues = attributeValues;
    }


    const data = await docClient.scan(params).promise();
    const items = data.Items;

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
            "Access-Control-Allow-Methods": "OPTIONS,GET",
        },
        body: JSON.stringify(items)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
