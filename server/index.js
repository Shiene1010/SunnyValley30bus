const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { getBusArrivalData } = require('./gbis');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Targets: Bus #30 at specific stops
const BUS_ROUTE_NAME = '30';
const WALKING_TIMES = {
    '228002215': 5, // Hyundai Morningside 1st
    '228003292': 10 // Bora Shinchang Apt
};

const MOCK_DATA = {
    '228002215': [{ routeName: '30', predictTime1: '8' }],
    '228003292': [{ routeName: '30', predictTime1: '12' }]
};

app.get('/api/arrival', async (req, res) => {
    try {
        const stations = [process.env.STATION_HYUNDAI, process.env.STATION_BORA];
        const results = await Promise.all(stations.map(async (stationId) => {
            let data;
            if (process.env.MOCK_MODE === 'true') {
                data = MOCK_DATA[stationId] || [];
            } else {
                data = await getBusArrivalData(stationId);
            }
            // Filter for Bus #30
            const bus30 = data.find(bus =>
                String(bus.routeName) === String(BUS_ROUTE_NAME) ||
                String(bus.routeId) === String(process.env.BUS_ROUTE_ID)
            );

            if (bus30) {
                const predictTime = parseInt(bus30.predictTime1, 10);
                const walkingTime = WALKING_TIMES[stationId] || 0;
                const bufferTime = 2;
                const timeToLeave = predictTime - walkingTime - bufferTime;

                return {
                    stationId,
                    stationName: stationId === process.env.STATION_HYUNDAI ? '현대모닝사이드1차' : '보라신창아파트',
                    predictTime,
                    timeToLeave,
                    status: timeToLeave > 5 ? 'SAFE' : (timeToLeave > 0 ? 'WARNING' : 'URGENT')
                };
            }
            return { stationId, error: 'No data for Bus #30' };
        }));

        res.json(results);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch bus data' });
    }
});

app.post('/api/feedback', (req, res) => {
    const { feedback } = req.body;
    console.log('Received feedback:', feedback);
    // In a real app, save to DB. For now, just log and return success.
    res.json({ success: true, message: 'Feedback received' });
});

if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
