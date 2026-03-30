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

    // [새로 추가할 코드] 스튜디오에서 넘어온 페이로드(데이터) 파싱하기
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const encodedPayload = urlParams.get('payload');

        if (encodedPayload) {
            try {
                // Base64 디코딩 후 JSON 객체로 변환
                const decodedString = atob(encodedPayload);
                const requestData = JSON.parse(decodedString);

                // 스키마에 정의된 slots 데이터(bus_number, station_name) 추출
                if (requestData.slots && requestData.slots.station_name) {
                    console.log("Studio에서 넘어온 데이터:", requestData.slots);

                    // TODO: 넘겨받은 정류장(station_name)이나 버스번호(bus_number)로 
                    // 화면 상단 제목을 바꾸거나, 특정 정류장 데이터를 필터링하도록 State를 업데이트할 수 있습니다.
                    alert(`Prompt-to-JSON Studio 요청 접수:\n정류장: ${requestData.slots.station_name}\n버스: ${requestData.slots.bus_number}번`);
                }
            } catch (e) {
                console.error("스튜디오 페이로드 해석 실패:", e);
            }
        }
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
