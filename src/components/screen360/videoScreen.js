/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/media-has-caption */
/* eslint-disable react/style-prop-object */
import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-mouse-cursor-component';
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React, { useEffect } from 'react';
import 'react-tippy/dist/tippy.css';

import Player from '../player';
import Portal from '../portal';

import locationIcon from './assets/location.png';
import arrowIcon from './assets/arrow.png';
import closeIcon from './assets/close.png';
import playIcon from './assets/play.png';

const VideoScreen = props => {
  const {
    info,
    duration,
    currentTime,
    isPlaying,
    isEditorMode,
    show,
    source: { srcUrl },
    metadata: { hotspots },
    firstLoad,
    onLoadedMetadata,
    onTimeUpdate,
    onHoverPortal,
    onBlurPortal,
    onClickPortal,
    onCloseInfo,
    onPlayClick,
    onChangeTime,
    onTogglePlay,
    onFullScreen,
    onLoadedVideo
  } = props;

  const handleLoadedVideo = () => {
    onLoadedVideo();
  };

  useEffect(() => {
    handleLoadedVideo();
  }, []);

  return (
    <div
      style={{
        height: isEditorMode ? 'calc(100% - 100px)' : '100%',
        position: 'absolute',
        width: '100%'
      }}
    >
      <Scene style="height: calc(100% - 50px)">
        <a-assets>
          <video
            id="video"
            preload="metadata"
            controls
            src={show ? srcUrl : null}
            onTimeUpdate={onTimeUpdate}
            onLoadedMetadata={onLoadedMetadata}
          />
          <img alt="" id="location" src={locationIcon} />
          <img alt="" id="arrow" src={arrowIcon} />
        </a-assets>

        <a-videosphere src="#video" />

        {duration - currentTime >= 1 &&
          hotspots.map(({ type, position, title, id, fromSecond, toSecond }, index) => {
            if (
              Boolean(fromSecond <= currentTime && toSecond >= currentTime) ||
              !fromSecond ||
              !toSecond
            ) {
              return (
                <Portal
                  key={index} // eslint-disable-line
                  type={type}
                  title={title}
                  position={position}
                  onHoverPortal={() => onHoverPortal(id)}
                  onBlurPortal={() => onBlurPortal(id)}
                  onClickPortal={onClickPortal(type, id)}
                />
              );
            }
            return null;
          })}
        <Entity id="camera" primitive="a-camera" mouse-cursor />
      </Scene>

      {info && (
        <div
          style={{
            top: 0,
            width: 500,
            height: 200,
            margin: '5% auto',
            left: isEditorMode ? 200 : 0,
            right: 0,
            position: 'absolute',
            borderRadius: 10,
            boxShadow: '3px 3px 10px black',
            background: '#000000cc',
            color: 'white',
            padding: 10
          }}
        >
          <img
            alt=""
            style={{
              width: 24,
              height: 24,
              position: 'absolute',
              right: '-15px',
              top: '-15px'
            }}
            src={closeIcon}
            onClick={onCloseInfo}
          />
          {info}
        </div>
      )}

      {firstLoad && (
        <div
          id="playvideo"
          style={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'fixed'
          }}
          onClick={onPlayClick}
        >
          <img
            alt=""
            style={{
              margin: '5% auto',
              left: 0,
              right: 0,
              position: 'fixed',
              opacity: 0.5,
              color: 'white',
              padding: 10
            }}
            src={playIcon}
            id="playButton"
          />
        </div>
      )}

      <Player
        isEditorMode={isEditorMode}
        currentTime={currentTime}
        duration={duration}
        isPlaying={isPlaying}
        onChangeTime={onChangeTime}
        onTogglePlay={onTogglePlay}
        onFullScreen={onFullScreen}
      />
    </div>
  );
};

export default VideoScreen;
