/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable consistent-return */
/* eslint-disable no-nested-ternary */
/* eslint-disable react/destructuring-assignment */
/* global document THREE */
import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-mouse-cursor-component';
import 'babel-polyfill';
import React from 'react';
import _ from 'lodash';
import { Tooltip } from 'react-tippy';
import 'react-tippy/dist/tippy.css';

import ImageScreen from './imageScreen';
import VideoScreen from './videoScreen';

import landImage from './assets/land.jpg';
import penguinsVideo from './assets/penguins.mp4';
import seagullsVideo from './assets/seagulls.mp4';
import sharksVideo from './assets/sharks.mp4';

const VIDEO_BY_ID = {
  penguins: penguinsVideo,
  seagulls: seagullsVideo,
  sharks: sharksVideo
};

const IMGAGE_BY_ID = {
  land: landImage
};

class Screen360 extends React.Component {
  constructor(props) {
    super(props);

    const { metadata: screens, screenId } = props;

    const screen = screens.length > 0 ? screens[screenId] : { type: 'image', url: null };

    this.state = {
      tooltip: null,
      info: null,
      firstLoad: true,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      currentScreenMetaData: screen,
      isVideo: screen.type === 'video',
      srcUrl: screen.type === 'video' ? VIDEO_BY_ID[screen.url] : IMGAGE_BY_ID[screen.url],
      hideAllPortal: false,
      isSwitching: false
    };
    this.videoELement = null;
  }

  componentDidMount() {
    const cameraEl = document.querySelector('#camera');
    const worldPos = new THREE.Vector3();
    worldPos.setFromMatrixPosition(cameraEl.object3D.matrixWorld);
    const handleChangeCamera = rotation => this.props.onChangeCamera(rotation);
    cameraEl.addEventListener('componentchanged', evt => {
      if (evt.detail.name !== 'rotation') {
        return;
      }
      const { x, y, z } = evt.detail.newData;
      handleChangeCamera({ x, y, z });
    });
  }

  getScreenFromId = id => _.find(this.props.metadata, s => s.id === id);

  getHotspotFromId = id => _.find(this.state.currentScreenMetaData.hotspots, h => h.id === id);

  getToolTipFromId = id => {
    const hotspot = this.getHotspotFromId(id);
    return hotspot ? hotspot.tooltip : '';
  };

  getInfoPortalFromId = id => {
    const hotspot = this.getHotspotFromId(id);
    return hotspot ? hotspot.info : '';
  };

  onClickPortal = (type, id) => {
    if (type === 'info') return () => this.handleClickInfoPortal(id);
    if (type === 'teleport') return () => this.handleClickTeleportPortal(id);
  };

  onHoverPortal = id => {
    this.setState({ tooltip: this.getToolTipFromId(id) });
  };

  onBlurPortal = () => {
    this.setState({ tooltip: null });
  };

  handleClickInfoPortal = id => {
    console.log(id, '====', this.getInfoPortalFromId(id));
    this.setState({ info: this.getInfoPortalFromId(id), isPlaying: false });
    if (this.videoELement) this.videoELement.pause();
  };

  handleClickTeleportPortal = id => {
    if (this.videoELement) this.videoELement.pause();
    const { nextId } = this.getHotspotFromId(id);
    const screen = this.getScreenFromId(nextId);
    this.switchScreen(screen);
  };

  switchScreen = screen => {
    let t = 2;
    const intervalSwitch = setInterval(() => {
      this.setState({ isSwitching: true });
      t -= 1;
      if (t <= 0) {
        clearInterval(intervalSwitch);
        this.setState({
          isVideo: screen.type === 'video',
          srcUrl: screen.type === 'video' ? VIDEO_BY_ID[screen.url] : IMGAGE_BY_ID[screen.url],
          currentScreenMetaData: screen,
          firstLoad: true,
          tooltip: null,
          isSwitching: false
        });

        this.props.onChangeScreen(screen.id);
      }
    }, 200);
  };

  handleCollide = () => {
    console.log('Collided!');
  };

  onCloseInfo = () => {
    this.setState({ info: null, isPlaying: true });
    this.videoELement.play();
  };

  onPlayClick = () => {
    this.videoELement.play();
    this.setState({ firstLoad: false, isPlaying: true });
  };

  onTogglePlay = () => {
    if (this.videoELement.paused) this.videoELement.play();
    else this.videoELement.pause();
    this.setState({ firstLoad: false, isPlaying: !this.videoELement.paused, info: null });
  };

  onFullScreen = () => {
    if (this.videoELement.requestFullscreen) {
      this.videoELement.requestFullscreen();
    } else if (this.videoELement.mozRequestFullScreen) {
      this.videoELement.mozRequestFullScreen(); // Firefox
    } else if (this.videoELement.webkitRequestFullscreen) {
      this.videoELement.webkitRequestFullscreen(); // Chrome and Safari
    }
  };

  onChangeTime = time => {
    this.videoELement.currentTime = time;
  };

  onTimeUpdate = () => {
    this.setState({ currentTime: this.videoELement.currentTime });

    if (this.videoELement.currentTime > 50) {
      this.setState({ hideAllPortal: true });
    } else this.setState({ hideAllPortal: false });
  };

  onLoadedMetadata = () => {
    this.setState({ duration: Math.round(this.videoELement.duration) });
  };

  onLoadedVideo = () => {
    this.videoELement = document.getElementById('video');
    this.videoELement.pause();
    if (this.state.firstLoad) setTimeout(() => document.getElementById('playvideo').click(), 500);
  };

  renderImageScreen = (isVideo, info, srcUrl, currentScreenMetaData, isEditorMode) => (
    <ImageScreen
      show={!isVideo}
      info={info}
      source={{ isVideo, srcUrl }}
      metadata={currentScreenMetaData}
      onHoverPortal={this.onHoverPortal}
      onBlurPortal={this.onBlurPortal}
      onClickPortal={this.onClickPortal}
      onCloseInfo={this.onCloseInfo}
      isEditorMode={isEditorMode}
    />
  );

  renderVideoScreen = (
    isVideo,
    info,
    duration,
    currentTime,
    isPlaying,
    hideAllPortal,
    srcUrl,
    firstLoad,
    currentScreenMetaData,
    isEditorMode
  ) => (
    <VideoScreen
      isEditorMode={isEditorMode}
      show={isVideo}
      firstLoad={firstLoad}
      info={info}
      duration={duration}
      currentTime={currentTime}
      isPlaying={isPlaying}
      hideAllPortal={hideAllPortal}
      source={{ isVideo, srcUrl }}
      metadata={currentScreenMetaData}
      onLoadedMetadata={this.onLoadedMetadata}
      onTimeUpdate={this.onTimeUpdate}
      onHoverPortal={this.onHoverPortal}
      onBlurPortal={this.onBlurPortal}
      onClickPortal={this.onClickPortal}
      onCloseInfo={this.onCloseInfo}
      onPlayClick={this.onPlayClick}
      onChangeTime={this.onChangeTime}
      onTogglePlay={this.onTogglePlay}
      onFullScreen={this.onFullScreen}
      onLoadedVideo={this.onLoadedVideo}
    />
  );

  render() {
    const {
      tooltip,
      isVideo,
      info,
      duration,
      currentTime,
      isPlaying,
      hideAllPortal,
      srcUrl,
      firstLoad,
      currentScreenMetaData,
      isSwitching
    } = this.state;
    const { isEditorMode } = this.props;
    return (
      <Tooltip
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          position: 'relative'
        }}
        open={Boolean(tooltip)}
        unmountHTMLWhenHide
        html={<div>{tooltip}</div>}
        position="top-end"
        followCursor
      >
        {isSwitching ? (
          <div />
        ) : !isVideo ? (
          this.renderImageScreen(isVideo, info, srcUrl, currentScreenMetaData, isEditorMode)
        ) : (
          this.renderVideoScreen(
            isVideo,
            info,
            duration,
            currentTime,
            isPlaying,
            hideAllPortal,
            srcUrl,
            firstLoad,
            currentScreenMetaData,
            isEditorMode
          )
        )}
        {isEditorMode && (
          <img
            alt=""
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 20,
              height: 20,
              marginLeft: -10,
              marginTop: -10,
              zIndex: 99
            }}
            src="http://babafoundation.org/wp-content/uploads/2018/08/iconmonstr-location-16-icon-256-1.png" // eslint-disable-line
          />
        )}
      </Tooltip>
    );
  }
}

export default Screen360;
