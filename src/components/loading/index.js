import React from 'react';
import injectSheet from 'react-jss';

const Loading = ({ classes }) => {
  return (
    <div className={classes.wrapper}>
      <img className={classes.spin} src="https://png.pngtree.com/svg/20161201/client_360_degree_view_277665.png"/>
    </div>
  )
}

const styles = {
  wrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
  },
  spin: {
    margin: 'auto',
    animation: "spin 2s infinite linear"
  },
  "@keyframes spin": {
    from: { transform: "rotate(0deg)"},
    to: { transform: "rotate(360deg)"}
  }
}

export default injectSheet(styles)(Loading);