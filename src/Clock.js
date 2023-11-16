import React, { useState, useEffect, useRef } from 'react';
import alarmSound from './audio/bedside-clock-alarm.mp3';

function Clock() {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [alarmTime, setAlarmTime] = useState(new Date());
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [remainingTime, setRemainingTime] = useState(null);
    const audioRef = useRef(new Audio(alarmSound));

    useEffect(() => {
        const updateTime = () => {
            setCurrentTime(new Date());
        }
        updateTime();

        const clockId = setInterval(updateTime, 1000);

        return () => clearInterval(clockId);
    },[]);

    useEffect(() => {
        if(isAlarmActive && (currentTime >= alarmTime)){
            playAlarm();
            setIsAlarmActive(false);
        } else {
            const timeDiff = alarmTime.getTime() - currentTime.getTime();
            const remainingHours = Math.floor(timeDiff / (1000 * 60 * 60));
            const remainingMinutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
            const remainingSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
            setRemainingTime({ hours: remainingHours, minutes: remainingMinutes, seconds: remainingSeconds });
        }

    }, [isAlarmActive, currentTime, alarmTime]);


    const playAlarm = () => {
        setAlertVisible(true);
        const audio = audioRef.current;
        audio.loop = true;
        audio.play();
    }

    const closeAlert = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.pause();
        setAlertVisible(false);
        setIsAlarmActive(false);
    
        window.removeEventListener('beforeunload', closeAlert);
      };

    const handleSetAlarm = () => {
        const now = Date.now();
        let newAlarmTime = new Date(
            new Date().getFullYear(),
            new Date().getMonth(),
            new Date().getDate(),
            selectedHour,
            selectedMinute,
            0,
            0
        );

        if (now > newAlarmTime.getTime()) {
            newAlarmTime.setDate(newAlarmTime.getDate() + 1);
        }

        setAlarmTime(newAlarmTime);
        setIsAlarmActive(true);
    }

    const handleCloseAlarm = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.pause();
        setAlertVisible(false);
        setIsAlarmActive(false);
    }

    const handleHourChange = (event) => {
        setSelectedHour(parseInt(event.target.value, 10));
      };
    
    const handleMinuteChange = (event) => {
        setSelectedMinute(parseInt(event.target.value, 10));
    };

  return (
    <div>
        <div>
            <h1>Current Time</h1>
            <h2>Current Time: {currentTime.toLocaleTimeString()}</h2>
        </div>
        <div>
            {isAlarmActive && remainingTime ? (
                <div>
                    <p>Remaining Time: {remainingTime.hours < 10 ? "0" + remainingTime.hours : remainingTime.hours}:{remainingTime.minutes < 10 ? "0" + remainingTime.minutes : remainingTime.minutes}:{remainingTime.seconds < 10 ? "0" + remainingTime.seconds : remainingTime.seconds}</p>
                </div>
            ) : (
                <div>
                    <p>Alarm is not active.</p>
                </div>
            )}
        </div>
        <div>
            <p>Alarm Time: {alarmTime.toLocaleString()}</p>
            <label>Select Hour: </label>
            <select value={selectedHour} onChange={handleHourChange}>
            {[...Array(24).keys()].map((hour) => (
                <option key={hour} value={hour}>
                {hour === 0 ? '12' : (hour <= 12 ? `${hour}` : `${hour - 12}`)} {hour < 12 ? 'AM' : 'PM'}
                </option>
            ))}
            </select>
            <label>Select Minute: </label>
            <select value={selectedMinute} onChange={handleMinuteChange}>
            {[...Array(60).keys()].map((minute) => (
                <option key={minute} value={minute}>
                {minute}
                </option>
            ))}
            </select>
            <button onClick={handleSetAlarm}>Set Alarm</button>
        </div>

        <div>
            <button onClick={playAlarm}>Test</button>
        </div>
        <div>
            <button onClick={handleCloseAlarm}>Stop</button>
        </div>

        {isAlertVisible && (
        <div className="alert-window">
          <p>Alarm is ringing!</p>
          <button onClick={closeAlert}>OK</button>
        </div>
        )}
    </div>
  );
}

export default Clock;