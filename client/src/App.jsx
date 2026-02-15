import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bus, Clock, MapPin, Send, MessageSquare } from 'lucide-react';

const App = () => {
    const [arrivals, setArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchArrivals = async () => {
        try {
            const response = await axios.get('/api/arrival');
            setArrivals(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching arrivals:', err);
            setError('Failed to fetch data. Please try again later.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArrivals();
        const interval = setInterval(fetchArrivals, 30000); // 30s refresh
        return () => clearInterval(interval);
    }, []);

    const sendFeedback = async () => {
        const feedback = prompt('Send feedback or report a delay:');
        if (feedback) {
            try {
                await axios.post('/api/feedback', { feedback });
                alert('Thank you for your feedback!');
            } catch (err) {
                alert('Failed to send feedback.');
            }
        }
    };

    if (loading) return <div className="loading">Initializing...</div>;

    return (
        <div className="dashboard">
            <header>
                <h1>BusNoti</h1>
                <p>Real-time Commute Dashboard</p>
            </header>

            {arrivals.map((bus, idx) => (
                <div key={idx} className="bus-card">
                    <div className="card-header">
                        <div className="station-info">
                            <h2>{bus.stationName}</h2>
                            <span><MapPin size={12} style={{ marginRight: 4 }} />To Sunny Valley</span>
                        </div>
                        <div className="bus-badge">30</div>
                    </div>

                    <div className="eta-container">
                        <span className="eta-value">{bus.predictTime}</span>
                        <span className="eta-unit">mins</span>
                    </div>

                    <div className={`leave-alert ${bus.status}`}>
                        <div className="leave-alert-header">
                            <Clock size={14} />
                            <span>Time to Leave Nagok Middle School</span>
                        </div>
                        <div className="leave-timer">
                            {bus.timeToLeave > 0 ? `${bus.timeToLeave} mins` : 'Leave NOW!'}
                        </div>
                    </div>
                </div>
            ))}

            {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

            <footer>
                <button className="feedback-btn" onClick={sendFeedback}>
                    <MessageSquare size={14} style={{ marginRight: 4 }} />
                    Send Feedback
                </button>
            </footer>
        </div>
    );
};

export default App;
