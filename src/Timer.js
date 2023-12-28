import React, { useState, useEffect, useRef } from 'react';
import alarmBedSide from './audio/bedside-clock-alarm.mp3';
import alarmSmartPhone from './audio/marimba-for-smartphone.mp3';
import alarmRing from './audio/ringtone.mp3';
import alarmSeatbelt from './audio/seatbelt-tone.mp3';
import alarmNotify from './audio/simple-notification.mp3';
import './Clock.css';


function Clock() {
    const weekdaysAcronym = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const monthsAcronym = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const audioSources = [
        { id: 1, name: 'Bedside', src: alarmBedSide },
        { id: 2, name: 'SmartPhone', src: alarmSmartPhone },
        { id: 3, name: 'RingPhone', src: alarmRing },
        { id: 4, name: 'SeatbeltTone', src: alarmSeatbelt },
        { id: 5, name: 'Notification', src: alarmNotify },
        // Add more audio sources as needed
      ];

    const [isInitialRender, setIsInitialRender] = useState(true);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [alarmTime, setAlarmTime] = useState(new Date());
    const [isAlarmActive, setIsAlarmActive] = useState(false);
    const [isAlertVisible, setAlertVisible] = useState(false);
    const [selectedHour, setSelectedHour] = useState(0);
    const [selectedMinute, setSelectedMinute] = useState(0);
    const [remainingTime, setRemainingTime] = useState(null);
    const [isAlarmSetting, setIsAlarmSetting] = useState(false);
    const [selectedAudio, setSelectedAudio] = useState(audioSources[0]);
    const audioRef = useRef(new Audio(selectedAudio.src));



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
        setIsAlarmSetting(false);
    }

    const handleCloseAlarm = () => {
        const audio = audioRef.current;
        audio.currentTime = 0;
        audio.pause();
        setAlertVisible(false);
        setIsAlarmActive(false);
    }

    const displayAlarm = () => {
        setIsInitialRender(false);
        setIsAlarmSetting(!isAlarmSetting);

    }

    const handleAudioChange = (event) => {
        const selectedId = parseInt(event.target.value, 10);
        const selected = audioSources.find((audio) => audio.id === selectedId);
        setSelectedAudio(selected);
        audioRef.current.src = selected.src;
      };

    const handleHourChange = (event) => {
        setSelectedHour(parseInt(event.target.value, 10));
      };
    
    const handleMinuteChange = (event) => {
        setSelectedMinute(parseInt(event.target.value, 10));
    };

    const arrowHourChange = (action) => {
        if (action === 'increment') {
          setSelectedHour((selectedHour) => (selectedHour + 1) % 24);
        } else if (action === 'decrement') {
          setSelectedHour((selectedHour) => (selectedHour - 1 + 24) % 24);
        }
      };
      
      const arrowMinutesChange = (action) => {
        if (action === 'increment') {
          setSelectedMinute((selectedMinute) => (selectedMinute + 1) % 60);
        } else if (action === 'decrement') {
          setSelectedMinute((selectedMinute) => (selectedMinute - 1 + 60) % 60);
        }
      };

  return (
    <div>
        <div>
            <h1>{currentTime.toLocaleTimeString()}</h1>
            <h2>{weekdaysAcronym[currentTime.getDay()]} - {monthsAcronym[currentTime.getMonth()]} {currentTime.getDate()} {currentTime.getFullYear()}</h2>
        </div>
        <div>
            {isAlarmActive && remainingTime ? (
                <div>
                    <p>Alarm Time: {alarmTime.getHours() === 0 ? '12' : (alarmTime.getHours() <= 12 ? alarmTime.getHours() : alarmTime.getHours() - 12)}:{alarmTime.getMinutes() < 10 ? "0" + alarmTime.getMinutes() : alarmTime.getMinutes()} {alarmTime.getHours() < 12 ? 'AM' : 'PM'}</p>
                    <p>Remaining Time: {remainingTime.hours < 10 ? "0" + remainingTime.hours : remainingTime.hours}:{remainingTime.minutes < 10 ? "0" + remainingTime.minutes : remainingTime.minutes}:{remainingTime.seconds < 10 ? "0" + remainingTime.seconds : remainingTime.seconds}</p>
                    <button onClick={handleCloseAlarm} className='btn btn-outline-danger'>Stop Alarm</button>
                </div>
            ) : (
                <div>
                    <button onClick={displayAlarm} className='btn btn-outline-success'>Edit Timer</button>
                </div>
            )}
        </div>
        { isAlarmSetting && !isAlertVisible ? (
                <div>
                    <div className="overlay" onClick={displayAlarm}></div>
                    <div className="popup">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Alarm</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={displayAlarm}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div>
                                <label>Hours</label>
                                
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className='btn btn-outline-secondary mx-1' onClick={() => arrowHourChange('decrement')}>&#60;</button>
                                    <select value={selectedHour} onChange={handleHourChange} className='form-select'>
                                    {[...Array(24).keys()].map((hour) => (
                                        <option key={hour} value={hour}>
                                        <span className='number-space equal-height'>
                                            {hour === 0 ? '12' : (hour <= 12 ? `${hour}` : `${hour - 12}`)} {hour < 12 ? 'AM' : 'PM'}
                                        </span>
                                        </option>
                                    ))}
                                    </select>
                                    <button className='btn btn-outline-secondary mx-1' onClick={() => arrowHourChange('increment')}>&#62;</button>
                                </div>

                                
                                
                                <label>Minutes</label>
                                <div className="d-flex justify-content-between align-items-center">
                                    <button className='btn btn-outline-secondary mx-1' onClick={() => arrowMinutesChange('decrement')}>&#60;</button>
                                    <select value={selectedMinute} onChange={handleMinuteChange} className='form-select'>
                                        {[...Array(60).keys()].map((minute) => (
                                            <option key={minute} value={minute} className='text-left'>
                                            {minute < 10 ? `0${minute}` : `${minute}`}
                                            </option>
                                        ))}
                                    </select>
                                    <button className='btn btn-outline-secondary mx-1' onClick={() => arrowMinutesChange('increment')}>&#62;</button>
                                </div>
                            </div>


                            <div>
                                <label>Sound</label>
                                <select value={selectedAudio.id} onChange={handleAudioChange} className='form-select'>
                                    {audioSources.map((audio) => (
                                    <option key={audio.id} value={audio.id} className='text-left'>
                                        {audio.name}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button onClick={playAlarm} className='btn btn-outline-primary m-2'>Test</button>
                            <button onClick={handleSetAlarm} className='btn btn-outline-success m-2'>Start</button>
                            <button onClick={displayAlarm} className='btn btn-outline-primary m-2'>Cancel</button>
                        </div>
                        </div>
                    </div>
                </div>
        ) : isAlertVisible ?
            <div>
                <div className="overlay" onClick={closeAlert}></div>
                <div className="popup">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Alarm</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={closeAlert}>
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div className="alert-window">

                                <p>Alarm is ringing!</p>
                                <button onClick={closeAlert} className='btn btn-outline-danger'>OK</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div> : !isInitialRender ?
            <div>
                <div className="overlay-fade-out"></div>
            </div> 
            : null}
    </div>
  );
}

export default Clock;