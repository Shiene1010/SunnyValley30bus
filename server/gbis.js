const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const API_KEY = process.env.GBIS_API_KEY;
const BASE_URL = 'http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalItemv2';

const parser = new xml2js.Parser({ explicitArray: false });

/**
 * Fetches bus arrival information for a specific station and route.
 * @param {string} stationId - The ID of the bus stop.
 * @returns {Promise<Object>} - Bus arrival information.
 */
async function getBusArrivalData(stationId) {
    try {
        const ROUTE_ID = process.env.BUS_ROUTE_ID;
        const url = `${BASE_URL}?serviceKey=${API_KEY}&stationId=${stationId}&routeId=${ROUTE_ID}`;
        const response = await axios.get(url);

        // API now returns JSON instead of XML
        const result = response.data;

        if (result.response.msgHeader.resultCode !== 0) {
            throw new Error(result.response.msgHeader.resultMessage);
        }

        const busItem = result.response.msgBody.busArrivalItem;

        // Convert to array format for compatibility with existing code
        return [{
            routeName: busItem.routeName,
            routeId: busItem.routeId,
            predictTime1: busItem.predictTime1,
            predictTime2: busItem.predictTime2,
            locationNo1: busItem.locationNo1,
            locationNo2: busItem.locationNo2,
            plateNo1: busItem.plateNo1,
            plateNo2: busItem.plateNo2,
            lowPlate1: busItem.lowPlate1,
            lowPlate2: busItem.lowPlate2
        }];
    } catch (error) {
        console.error(`Error fetching bus data for station ${stationId}:`, error.message);
        throw error;
    }
}

module.exports = { getBusArrivalData };
