import 'aframe';
import 'aframe-animation-component';
import 'aframe-particle-system-component';
import 'aframe-mouse-cursor-component'
import 'babel-polyfill';
import { Entity, Scene } from 'aframe-react';
import React from 'react';
import _ from 'lodash';
// import ReactDOM from 'react-dom';

import Player from './../player';
import Portal from './../portal';

import mountainImage from './assets/puydesancy.jpg';
import locationIcon from './assets/location.png';
import flagIcon from './assets/flag.png';
import penguinsVideo from './assets/penguins.mp4';
import seagullsVideo from './assets/seagulls.mp4';
import sharksVideo from './assets/sharks.mp4';
import closeIcon from './assets/close.png';
import playIcon from './assets/play.png';

const VIDEO_BY_ID = {
  penguins: penguinsVideo,
  seagulls: seagullsVideo,
  sharks: sharksVideo
}

class Screen360 extends React.Component {
  constructor(props) {
    super(props);
    console.log(props.metadata);

    this.state = {
      color: 'red',
      info: null,
      firstLoad: true,
      isPlaying: false,
      currentTime: 0,
      duration: 0,
      source: {
        isVideo: true,
        srcUrl: penguinsVideo
      },
      hideAllPortal: false
    };
    this.videoELement = null;
  }

  getHotspotFromId = id => _.find(this.props.metadata, h => h.id == id);

  getInfoPortalFromId = id => {
    const hotspot = this.getHotspotFromId(id);
    return hotspot ? hotspot.info : "";
  }

  getNextUrlFromId = id => {
    const hotspot = this.getHotspotFromId(id);
    return hotspot ? hotspot.nextUrl : "";
  }

  onClickPortal = (type, id) => {
    if(type=="info") return () => this.handleClickInfoPortal(id);
    if(type=="teleport") return () => this.handleClickTeleportPortal(id);
  }

  handleClickInfoPortal = id => {
    this.setState({ info: this.getInfoPortalFromId(id), isPlaying: false });
    this.videoELement.pause();
  }

  handleClickTeleportPortal = id => {
    this.setState({ source: { isVideo: true, srcUrl: VIDEO_BY_ID[this.getNextUrlFromId(id)] } });
  }

  handleCollide = () => {
    console.log('Collided!');
  }

  onCloseInfo = () => {
    this.setState({ info: null, isPlaying: true });
    this.videoELement.play();
  }

  onPlayClick = () => {
    this.videoELement.play();
    this.setState({ firstLoad: false, isPlaying: true })
  }

  onTogglePlay = () => {
    if (this.videoELement.paused) this.videoELement.play(); 
    else this.videoELement.pause();
    this.setState({ firstLoad: false, isPlaying: !this.videoELement.paused, info: null })
  }

  onFullScreen = () => {
    if (this.videoELement.requestFullscreen) {
      this.videoELement.requestFullscreen();
    } else if (this.videoELement.mozRequestFullScreen) {
      this.videoELement.mozRequestFullScreen(); // Firefox
    } else if (this.videoELement.webkitRequestFullscreen) {
      this.videoELement.webkitRequestFullscreen(); // Chrome and Safari
    }
  }

  onChangeTime = time => {
    this.videoELement.currentTime = time;
  }

  onTimeUpdate = (e) => {
    this.setState({currentTime: this.videoELement.currentTime})

    if(this.videoELement.currentTime > 50) {
      this.setState({hideAllPortal: true})
    } else this.setState({hideAllPortal: false})
  }

  onLoadedMetadata = e => {
    this.setState({ duration: Math.round(this.videoELement.duration) });
  }

  componentDidMount() {
    this.videoELement = document.getElementById("video");
    this.videoELement.pause();
  }

  render() {
    const { info, duration, currentTime, isPlaying, hideAllPortal, source: { isVideo, srcUrl} } = this.state;
    const { metadata: {hotspots} } = this.props;
    return (
      <div>
        <Scene>
          <a-assets>
            <img id="groundTexture" src="https://cdn.aframe.io/a-painter/images/floor.jpg" />
            <img id="skyTexture" src="https://cdn.aframe.io/a-painter/images/sky.jpg" />
            <video id="video"
              preload="metadata"
              controls
              src={srcUrl}
              onTimeUpdate={this.onTimeUpdate}
              onLoadedMetadata={this.onLoadedMetadata}
            />
            <img id="location" src={locationIcon} />
            <img id="flag" src={flagIcon} />
            <img id="mountain" src={mountainImage} />
          </a-assets>

          <Entity primitive="a-light" type="ambient" color="#445451" />
          <Entity primitive="a-light" type="point" intensity="2" position="2 4 4" />
          <Entity primitive="a-sky" src="#video" rotation="0 -130 0" />

          {/* <Portal type="info" title="rockyyyyyyyyyyyyy" position={{x:1, y:0.75, z:-3}} onClickPortal={this.onClickPortal("info")} />
          <Portal type="teleport" title="rocky" position={{x:-5, y:0.9, z:6}} onClickPortal={this.onClickPortal("info")} /> */}
          {hotspots.map(({type, position, title, id}, index) => <Portal key={index} type={type} title={title} position={position} onClickPortal={this.onClickPortal(type, id)} />)}

          {/* <Entity text={{ value: 'Hello, A-Frame React!', align: 'center' }} position={{ x: 0, y: 2, z: -1 }} /> */}
          <Entity primitive="a-camera" mouse-cursor>
          </Entity>
        </Scene>

        {info && <div style={{
          width: 500,
          height: 200,
          margin: '5% auto',
          left: 0,
          right: 0,
          position: 'fixed',
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
            onClick={this.onCloseInfo}
          />
          {info}
        </div>}

        {this.state.firstLoad && <div
          style={{
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            position: 'fixed'
          }}
          onClick={this.onPlayClick}
        >
          <img
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
        }

        <Player
          currentTime={currentTime}
          duration={duration}
          isPlaying={isPlaying}
          onChangeTime={this.onChangeTime}
          onTogglePlay={this.onTogglePlay}
          onFullScreen={this.onFullScreen}
        />
      </div>
    );
  }
}

export default Screen360;
