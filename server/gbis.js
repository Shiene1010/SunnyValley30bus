const axios = require('axios');
const xml2js = require('xml2js');
require('dotenv').config();

const API_KEY = process.env.GBIS_API_KEY;
const BASE_URL = 'http://apis.data.go.kr/6410000/busarrivalservice/v2/getBusArrivalListv2';

const parser = new xml2js.Parser({ explicitArray: false });

/**
 * Fetches bus arrival information for a specific station.
 * @param {string} stationId - The ID of the bus stop.
 * @returns {Promise<Array>} - List of arriving buses.
 */
async function getBusArrivalData(stationId) {
    try {
        const response = await axios.get(BASE_URL, {
            params: {
                serviceKey: API_KEY,
                stationId: stationId
            }
        });

        const result = await parser.parseStringPromise(response.data);
        const busArrivalList = result.response.msgBody.busArrivalList;

        // If it's a single item, wrap it in an array
        return Array.isArray(busArrivalList) ? busArrivalList : [busArrivalList];
    } catch (error) {
        console.error(`Error fetching bus data for station ${stationId}:`, error.message);
        throw error;
    }
}

module.exports = { getBusArrivalData };
