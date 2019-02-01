const styles = {
  root: {
    flexGrow: 1,
  },
  zIndex2: {
    zIndex: 2
  },
  fullScreen: {
    width: '100%',
    height: '100%'
  },
  flexDisplay: {
    display: 'flex',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column'
  },
  flexCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  fullFlex: {
    flex: 1
  },
  link: {
    textDecoration: 'unset',
    margin: '0 6px',
    cursor: 'pointer'
  },
  linkLight: {
    color: 'white',
    '&:hover': {
      color: 'lightblue'
    },
  },
  linkDark: {
    color: 'darkgray',
    '&hover': {
      color: 'lightblue'
    }
  },
  capitalize: {
    textTransform: 'capitalize'
  },
  darkBackground: {
    '&:before': {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      opacity: 0.22,
      display: 'block',
      content: '""',
      zIndex: 0,
      position: 'absolute',
      background: '#fff',
    }
  },
  menuButton: {
    marginLeft: -18,
    marginRight: 10,
  },
  fullAbsolute: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  }
};

export default styles;