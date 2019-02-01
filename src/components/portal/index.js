import React from 'react';
import { Entity } from 'aframe-react';
import PanelText from './../panelText';

const ID_BY_TYPE = {
  info: 'infoportal',
  teleport: 'teleportportal'
}

const SRC_BY_TYPE = {
  info: '#location',
  teleport: '#arrow'
}

const getDegFromSin = sinVl => Math.asin(sinVl) * 180 / Math.PI;

const Portal = props => {
  const { onClickPortal, onHoverPortal, onBlurPortal, onCollidePotral, position: {x, y, z}, radius, type, title } = props;
  const _type = type || 'info';
  const _radius = radius || 0.5;
  const _position = `${x} ${y} ${z}`;
  const infoTo = `${x} ${y + 0.25} ${z}`;
  const teleTo = `${x-(x/4)} ${y} ${z-(z/4)}`;
  const _positionTitle = `${x} ${y + 0.25} ${z}`;
  const rotationY = z < 0 ? -getDegFromSin(x/Math.sqrt(Math.pow(x,2)+Math.pow(z,2))) : getDegFromSin(x/Math.sqrt(Math.pow(x,2)+Math.pow(z,2)));
  const rotationX = z > y ? -getDegFromSin(y/z) : 0;
  const rotation = _type == 'info' ? `${rotationX} ${rotationY} 0` : `60 ${rotationY} 0`;
  const animationInfo =
    <a-animation
      attribute="position"
      to={infoTo}
      direction="alternate"
      dur="500"
      repeat="indefinite">
    </a-animation>
  const animationTele =
    <a-animation
      attribute="position"
      to={teleTo}
      direction="alternate"
      dur="500"
      repeat="indefinite">
    </a-animation>

  return (
    <Entity
      id={ID_BY_TYPE[type]}
      events={{ click: onClickPortal, collided: [onCollidePotral], mouseenter: onHoverPortal, mouseleave: onBlurPortal }}
      primitive="a-circle"
      src={SRC_BY_TYPE[_type]}
      position={_position}
      material="side: double; color: #EF2D5E; transparent: true; opacity: .8"
      radius={_radius}
      rotation={rotation}
    >
      {/* {title && <PanelText text={title} position={_positionTitle}/> } */}
      { _type == 'info' ? animationInfo : animationTele }
    </Entity>
  )
}

export default Portal;