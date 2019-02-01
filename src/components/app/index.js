import React, { useState, useEffect } from 'react';
import injectSheet from 'react-jss';
import c from 'classnames';
import _ from 'lodash';
import Frame from 'react-frame-component';

import Screen360 from './../screen360';
import Editor from './../editor';
import Loading from './../loading';

import input from './../../input/demo.json';

const App = props => {
  const { classes } = props;
  const [isOpenEditor, setOpenEditor] = useState(false);
  const [currentScreenId, setcurrentScreenId] = useState(0);
  const [metadata, setMetadata] = useState(input);
  const [isLoading, setLoading] = useState(false);
  const [position, setPositon] = useState({x:0,y:0,z:0});

  const onCloseEditor = () => {
    setOpenEditor(false);
  }

  const onOpenEditor = () => {
    setOpenEditor(true);
  }

  const getIndexFromId = (id, list) => _.findIndex(list, s => s.id == id);

  const getScreenFromIndex = (index, list) => list[index];

  const onChangeScreen = id => {
    const index = getIndexFromId(id, metadata);
    setcurrentScreenId(index);
    reLoadPreview();
  }

  const reLoadPreview = () => {
    let t = 2;
    let intervalSwitch = setInterval(()=> {
      setLoading(true);
      t--;
      if (t<=0) { clearInterval(intervalSwitch); setLoading(false);}
    }, 200);
  }

  const onAddHotspot = newHotspot => {
    let newMetadata = _.cloneDeep(metadata);
    const screen = getScreenFromIndex(currentScreenId, newMetadata);
    screen.hotspots.push(newHotspot)

    setMetadata(newMetadata);
    reLoadPreview();
  }

  const onDeleteHotspot = id => {
    let newMetadata = _.cloneDeep(metadata);
    const screen = getScreenFromIndex(currentScreenId, newMetadata);
    screen.hotspots = _.remove(screen.hotspots, h => h.id != id);

    setMetadata(newMetadata);
    reLoadPreview();
  }

  const onChangeCamera = rotation => {
    const { x, y, z } = rotation;
    const en = Math.PI/180;

    const newY = Math.sin(x*en)*10 + 2; // distance from the ground of the camera is 2 meters
    const newX = -Math.sin(y*en)*(10*Math.cos(x*en));
    const newZ = -Math.cos(x*en)*Math.cos(y*en)*10;

    setPositon({x: newX, y: newY, z: newZ});
  }

  return (
    <div className={classes.app}>
      {!isOpenEditor ?
        <div className={classes.openEditor} onClick={onOpenEditor}>
          Open Editor >>>
        </div>
        :
        <Editor
          onClose={onCloseEditor}
          metadata={metadata}
          screenId={currentScreenId}
          onAddHotspot={onAddHotspot}
          onChangeScreen={onChangeScreen}
          onChangeCamera={onChangeCamera}
          onDeleteHotspot={onDeleteHotspot}
          position={position}
        />
      }
      {!isLoading ?
        <Screen360
          metadata={metadata}
          isEditorMode={isOpenEditor}
          screenId={currentScreenId}
          onChangeScreen={onChangeScreen}
          onChangeCamera={onChangeCamera}
        />
        :
        <Loading />
      }
    </div>
  )
}

const styles = {
  app: {
    width: "100%",
    height: "100%",
    position: 'relative',
    overflow: 'hidden',
  },
  openEditor: {
    background: 'white',
    position: 'absolute',
    zIndex: 2,
    cursor: 'pointer'
  }
}

export default injectSheet(styles)(App);