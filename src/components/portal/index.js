import React from 'react';
import { Entity } from 'aframe-react';
import PanelText from './../panelText';

const ID_BY_TYPE = {
  info: 'infoportal',
  teleport: 'teleportportal'
}

const SRC_BY_TYPE = {
  info: '#location',
  teleport: '#flag'
}

const Portal = props => {
  const { onClickPortal, onCollidePotral, position: {x, y, z}, radius, type, title } = props;
  const _type = type || 'info';
  const _radius = radius || 0.5;
  const _position = `${x} ${y} ${z}`;
  const to = `${x} ${y + 0.25} ${z}`;
  const _positionTitle = `${x} ${y + 0.25} ${z}`;
  const animationElement =
    <a-animation
      attribute="position"
      to={to}
      direction="alternate"
      dur="500"
      repeat="indefinite">
    </a-animation>

  return (
    <Entity
      id={ID_BY_TYPE[type]}
      events={{ click: onClickPortal,collided: [onCollidePotral] }}
      primitive="a-circle"
      src={SRC_BY_TYPE[_type]}
      position={_position}
      material="side: double; color: #EF2D5E; transparent: true; opacity: .8"
      radius={_radius}
    >
      {/* {title && <PanelText text={title} position={_positionTitle}/> } */}
      { animationElement }
    </Entity>
  )
}

export default Portal;