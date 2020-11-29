// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
const dynamodb = require('aws-sdk/clients/dynamodb');
const { v4: uuidv4 } = require('uuid');
const docClient = new dynamodb.DocumentClient();

// Get the DynamoDB table name from environment variables
const tableName = process.env.SEASONS_TABLE;

/**
 * A simple example includes a HTTP post method to add one item to a DynamoDB table.
 */
exports.putSeasonHandler = async (event) => {
    if (event.httpMethod !== 'POST') {
        throw new Error(`postMethod only accepts POST method, you tried: ${event.httpMethod} method.`);
    }
    // All log statements are written to CloudWatch
    console.info('received:', event);

    // Get id and name from the body of the request
    const body = JSON.parse(event.body);
    // const id = body.id;
    const id = uuidv4();
    const species = body.species;
    const subspecies = body.subspecies || null;
    const antlered = body.antlered || null;
    const controlled = body.controlled;
    const regionId = body.regionId;
    const seasonStart = body.seasonStart;
    const seasonEnd = body.seasonEnd;
    const weaponType = body.weaponType;

    // Creates a new item, or replaces an old item with a new item
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
    const params = {
        TableName : tableName,
        Item: {
            id : id,
            species: species,
            subspecies: subspecies,
            antlered: antlered,
            controlled: controlled,
            regionId: regionId,
            seasonStart: seasonStart,
            seasonEnd: seasonEnd,
            weaponType: weaponType
        }
    };

    if (!species || !regionId || !seasonStart || !seasonEnd || !weaponType) {
        throw new Error(`invalid params: ${params}`);
    }

    const result = await docClient.put(params).promise();

    const response = {
        statusCode: 200,
        headers: {
            "Access-Control-Allow-Origin": "*", // Required for CORS support to work
            "Access-Control-Allow-Credentials": true, // Required for cookies, authorization headers with HTTPS
            "Access-Control-Allow-Methods": "OPTIONS,POST",
        },
        body: JSON.stringify(body)
    };

    // All log statements are written to CloudWatch
    console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
};
