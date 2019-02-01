import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-mouse-cursor-component'
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import 'react-tippy/dist/tippy.css';

import Portal from './../portal';

// import mountainImage from './assets/puydesancy.jpg';
import locationIcon from './assets/location.png';
import arrowIcon from './assets/arrow.png';
import closeIcon from './assets/close.png';

const ImageScreen = props => {
  const {
    info, show, source: { isVideo, srcUrl}, metadata: {hotspots},
    onHoverPortal, onBlurPortal, onClickPortal, onCloseInfo,
    isEditorMode
  } = props;
  return (
    <div>
      <Scene>
        <a-assets>
          <img id="skyimage" src={show ? srcUrl : null} />
          <img id="location" src={locationIcon} />
          <img id="arrow" src={arrowIcon} />
          {/* <img id="mountain" src={mountainImage} /> */}
        </a-assets>

        <Entity primitive="a-sky" src="#skyimage" />
        {/* <a-sphere src="#skyimage"></a-sphere> */}

        {hotspots.map(({type, position, title, id}, index) => 
          <Portal
            key={index}
            type={type}
            title={title}
            position={position}
            onHoverPortal={() => onHoverPortal(id)}
            onBlurPortal={() => onBlurPortal(id)}
            onClickPortal={ onClickPortal(type, id)}
          />
        )}
        <Entity id="camera" primitive="a-camera" mouse-cursor>
        </Entity>
      </Scene>

      {info && <div style={{
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
      }}>
        <img
          style={{
            width: 24,
            height: 24,
            position: 'absolute',
            right: '-15px',
            top: '-15px',
          }}
          src={closeIcon}
          onClick={onCloseInfo}
        />
        {info}
      </div>}
    </div>
  )
}

export default ImageScreen;