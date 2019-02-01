import React, { useState, useEffect } from 'react';
import injectSheet from 'react-jss';
import c from 'classnames';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const Editor = props => {
  const { classes, onClose, metadata, screenId, onAddHotspot, position, onChangeScreen, onDeleteHotspot } = props;
  const [ isOpenAdd, setIsOpenAdd ] = useState(false);
  const [ name, setName ] = useState("");
  const [ info, setInfo ] = useState("");
  const [ nextId, setNextId ] = useState("");
  const [ tooltip, setTooltip ] = useState("");
  const [ type, setType ] = useState('info');
  const [ x, setX ] = useState(position.x);
  const [ y, setY ] = useState(position.y);
  const [ z, setZ ] = useState(position.z);

  const setRotation = () => {
    setX(position.x);
    setY(position.y);
    setZ(position.z);
  }

  useEffect(()=> {
    setRotation()
  }, [props.position])

  const getScreenByIndex = index => metadata[index];
  
  const handleAddNewHotspot = () => {
    const randomId = Math.random().toString(36).substring(2);
    const newHotspot = {
      "id": randomId,
      "position": {"x":x, "y":y, "z":z},
      "radius": "0.5",
      "type": type,
      "info": info,
      "nextId": nextId,
      "title": "",
      "tooltip": tooltip
    }
    onAddHotspot(newHotspot);
  }

  const onClickScreenItem = id => {
    onChangeScreen(id);
  }

  const onChangeType = e => {
    setType(e.target.value)
  }

  const handleClickAdd = () => setIsOpenAdd(true);
  const handleCloseAdd = () => setIsOpenAdd(false);
  const handleApplyHotspot = () => handleAddNewHotspot();
  // const handleApplyPosition = () => {
  //   const en = Math.PI/180;

  //   // let y = Math.sin(newX*en)*10 + 2; // distance from the ground of the camera is 2 meters
  //   // let x = Math.sin(newY*en)*(10*Math.cos(newX*en));
  //   // let newZ = Math.cos(newX*en)*Math.cos(newY*en)*10;

  //   const newX = Math.asin((y - 2)/10)/en;
  //   const newY = Math.asin(x/(10*Math.cos(newX*en)))/en;

  //   onChangeCamera({x: newX,y: newY, z: 0});
  //   console.log("x:",newX,"y:", newY);
  // }

  const renderHotspotRow = h => <ExpansionPanel key={h.id}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.ExpansionPanelSummary}>
      <Typography className={classes.heading}>Id:{h.id} - Type:{h.type}</Typography>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Typography>
        Title: {h.title}<br/>
        Tooltip: {h.tooltip}<br/>
        Position: <br/>
        - x:{h.position.x} <br/>
        - y:{h.position.y} <br/>
        - z:{h.position.z} <br/>
        {h.info && <span>info: {h.info}<br/></span> }
        {h.nextId && <span>nextId: {h.nextId}<br/></span> }
        <button onClick={()=>onDeleteHotspot(h.id)}>Delete</button>
      </Typography>
    </ExpansionPanelDetails>
  </ExpansionPanel>

  return (
    <div className={c(classes.editor, classes.open)}>
      <div className={classes.close} onClick={onClose}> X </div>
      <div className={classes.title}>VRTour Editor</div>
      
      Screen Info <br/>
      Index:{screenId} <br/>
      ID: {getScreenByIndex(screenId).id} <br/>
      Name: {getScreenByIndex(screenId).name} <br/>
      hotspots:
      <div className={classes.root}>
        {getScreenByIndex(screenId).hotspots.map(h => renderHotspotRow(h))}
      </div>

      { isOpenAdd && 
        <div className={classes.addhotspot}>
          <hr/>
          = Add hotspot =<br/>
          name: <input type="text" value={name} onChange={e => setName(e.target.value)}/><br/>
          type:<select onChange={onChangeType}>
            <option checked={type=="info"} value="info">info</option>
            <option checked={type=="teleport"} value="teleport">teleport</option>
          </select><br/>
          {type=="info" ?
            <span>info: <input type="text" value={info} onChange={e => setInfo(e.target.value)}/><br/></span>
            :
            <span>next screen:
              <select onChange={e => setNextId(e.target.value)}>
                {metadata.map(s => (<option key={s.id} checked={type==s.id} value={s.id}>{s.name}</option>))}
              </select><br/>
            </span>
          }
          tooltip: <input type="text" value={tooltip} onChange={e => setTooltip(e.target.value)}/><br/>
          x: <input type="text" value={x} onChange={e => setX(e.target.value)}/><br/>
          y: <input type="text" value={y} onChange={e => setY(e.target.value)}/><br/>
          z: <input type="text" value={z} onChange={e => setZ(e.target.value)}/><br/>
          <div className={classes.flex}>
            <div className={c(classes.button)} onClick={handleApplyHotspot}>Apply Hotspot</div>
            ~
            <div className={c(classes.button)} onClick={handleCloseAdd}>Close</div>
          </div>
          <hr/>
        </div>
      }

      <div className={classes.tool}>
        { !isOpenAdd &&
          <div className={c(classes.button, classes.add)} onClick={handleClickAdd}>
            Add hotspot
          </div>
        }
      </div>
        

      <div className={classes.bottom}>
        {metadata.map(s => (
          <div
            key={s.id}
            className={c(classes.screenItem, {[classes.selectedScreen]: s.id==getScreenByIndex(screenId).id})}
            onClick={() => onClickScreenItem(s.id)}
          >
            id: {s.id}<br/>
            {s.name}
          </div>
        ))}
      </div>

      <div className={classes.right}>
      </div>
    </div>
  )
}

const styles = {
  editor: {
    width: 200,
    top: 0,
    left: 0,
    bottom: 100,
    zIndex: 2,
    background: '#000000f0',
    position: 'absolute',
    color: 'white',
  },
  open: {
    animation: "open 0.3s linear"
  },
  "@keyframes open": {
    from: { opacity: 0, width: 0 },
    to: { opacity: 1, width: 200 }
  },
  button: {
    boxShadow: "1px 1px 2px gray",
    cursor: "pointer",
    background: "#ad0000",
    '&:hover': {
      boxShadow: 'unset',
      background: "#400000"
    }
  },
  close: {
    right: 0,
    position: 'absolute',
    width: 30,
    height: 30,
    background: '#ff0006bd',
    textAlign: 'center',
    lineHeight: '30px',
    cursor: 'pointer'
  },
  title: {
    textAlign: 'center',
    height: 30,
    lineHeight: '30px',
    borderBottom: '1px solid white',
    background: "linear-gradient(to right, #192dbf, #00bbda)"
  },
  tool: {
    background: "blue",
    bottom: 0,
    display: "flex"
  },
  addhotspot: {

  },
  flex: {
    display: 'flex'
  },
  add: {
    // background: "red"
  },
  ExpansionPanelSummary: {
    height: 24,
    minHeight: 'unset'
  },
  bottom: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    background: 'black',
    display: 'flex',
    overflow: 'auto',
    alignItems: 'center',
  },
  screenItem: {
    height: 75,
    minWidth: 80,
    background: 'white',
    margin: 5,
    color: 'black'
  },
  selectedScreen: {
    outline: '5px solid yellow'
  },
  right: {
    // position: 'fixed',
    // top: 30,
    // bottom: 100,
    // right: 0,
    // width: 200,
    // background: 'black',
  },
}

export default injectSheet(styles)(Editor);