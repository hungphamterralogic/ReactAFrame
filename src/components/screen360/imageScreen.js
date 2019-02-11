/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-mouse-cursor-component';
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import 'react-tippy/dist/tippy.css';

import Portal from '../portal';

import locationIcon from './assets/location.png';
import arrowIcon from './assets/arrow.png';
import closeIcon from './assets/close.png';

const ImageScreen = props => {
  const {
    info,
    show,
    source: { srcUrl },
    metadata: { hotspots },
    onHoverPortal,
    onBlurPortal,
    onClickPortal,
    onCloseInfo,
    isEditorMode
  } = props;
  return (
    <div>
      <Scene>
        <a-assets>
          <img alt="" id="skyimage" src={show ? srcUrl : null} />
          <img alt="" id="location" src={locationIcon} />
          <img alt="" id="arrow" src={arrowIcon} />
        </a-assets>

        <Entity primitive="a-sky" src="#skyimage" />

        {hotspots.map(({ type, position, title, id }, index) => (
          <Portal
            key={index} // eslint-disable-line
            type={type}
            title={title}
            position={position}
            onHoverPortal={() => onHoverPortal(id)}
            onBlurPortal={() => onBlurPortal(id)}
            onClickPortal={onClickPortal(type, id)}
          />
        ))}
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
    </div>
  );
};

export default ImageScreen;
