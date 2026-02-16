const axios = require('axios');
require('dotenv').config({ path: './server/.env' });

const API_KEY = process.env.GBIS_API_KEY;
const STATION_ID = '228002215'; // Hyundai Morningside 1st

async function test(url, keyParamName = 'serviceKey') {
    console.log(`\n--- Testing ${url} (${keyParamName}) ---`);
    try {
        const response = await axios.get(url, {
            params: {
                [keyParamName]: API_KEY,
                stationId: STATION_ID
            }
        });
        console.log('Success!');
        console.log(response.data.substring(0, 500));
    } catch (error) {
        console.error('Error:', error.message);
        if (error.response) {
            console.error('Status:', error.response.status);
            console.error('Data:', error.response.data);
        }
    }
}

async function run() {
    // Data Portal v2
    await test('http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2');

    // GBIS Direct
    await test('http://openapi.gbis.go.kr/ws/rest/busarrivalservice/station');

    // Gyeonggi Data Dream
    await test('https://openapi.gg.go.kr/BusArrivalService', 'KEY');

    // Route Search
    await test('http://apis.data.go.kr/6410000/busrouteservice/v2/getBusRouteListv2', 'serviceKey');
}

run();
