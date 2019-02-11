import React from 'react';

const PanelText = ({ position, text }) => (
  <a-text
    geometry="primitive: plane; width: auto; height: 0.5"
    value={text}
    align="center"
    position={position || { x: 1, y: 1, z: 1 }}
    wrap-count="30"
  />
);

export default PanelText;
