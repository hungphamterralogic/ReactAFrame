/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useState } from 'react';
import injectSheet from 'react-jss';
import c from 'classnames';
import Slider from 'react-rangeslider';

import './styles.css';

import playIcon from './imgs/whiteplay.png';
import pauseIcon from './imgs/whitepause.png';
import fullScreenIcon from './imgs/whitefullscreen.png';

const Player = props => {
  const {
    classes,
    onTogglePlay,
    onFullScreen,
    onChangeTime,
    currentTime,
    duration,
    isPlaying,
    isEditorMode
  } = props;
  const [time, setTime] = useState(currentTime);
  const [change, setChange] = useState(false);

  const handleChangeStart = () => {
    setChange(true);
  };

  const handleChange = value => {
    setTime(value);
  };

  const handleChangeComplete = () => {
    setChange(false);
    onChangeTime(time);
  };

  const addZero = num => (num < 10 ? `0${num}` : num);

  const convertTime = sTime => {
    const hrs = Math.floor(sTime / 3600);
    const mins = Math.floor((sTime % 3600) / 60);
    const secs = Math.floor(sTime % 60);
    return hrs > 0
      ? `${hrs}:${addZero(mins)}:${addZero(secs)}`
      : `${addZero(mins)}:${addZero(secs)}`;
  };

  return (
    <div className={c(classes.player, { [classes.editMode]: isEditorMode })}>
      <img
        alt=""
        className={classes.icon}
        onClick={onTogglePlay}
        src={isPlaying ? pauseIcon : playIcon}
        id="playButton"
      />
      <Slider
        min={0}
        max={duration || 100}
        value={change ? time : currentTime}
        onChangeStart={handleChangeStart}
        onChange={handleChange}
        onChangeComplete={handleChangeComplete}
      />
      <div className={classes.timeStatus}>
        {`${convertTime(currentTime)}/${convertTime(duration)}`}
      </div>
      <img
        alt=""
        className={classes.icon}
        onClick={onFullScreen}
        src={fullScreenIcon}
        id="playButton"
      />
    </div>
  );
};

const styles = {
  player: {
    left: 0,
    right: 0,
    height: 50,
    bottom: 0,
    position: 'absolute',
    background: '#00000080',
    display: 'flex'
  },
  editMode: {
    left: 200
  },
  icon: {
    height: 30,
    width: 30,
    opacity: 0.8,
    padding: 10
  },
  timeStatus: {
    display: 'flex',
    color: 'white',
    alignItems: 'center',
    padding: 10
  }
};

export default injectSheet(styles)(Player);
