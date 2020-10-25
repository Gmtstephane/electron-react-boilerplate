import React from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import IconButton from '@material-ui/core/IconButton';
import Brightness3 from '@material-ui/icons/Brightness3';
import Brightness7 from '@material-ui/icons/Brightness7';
import SettingsIcon from '@material-ui/icons/Settings';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import PodTable from './PodTable';
import routes from '../constants/routes.json';
import { Link } from 'react-router-dom';
import { Switch, Route, Router } from 'react-router-dom';
import SvgIcon from '@material-ui/core/SvgIcon';
const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    titlebar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    appBar: {
      backgroundColor: theme.palette.background.default,
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      display: 'flex',
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      // marginRight: 36,
      color: theme.palette.text.primary,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      border: '0px',
      backgroundColor: 'transparent',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    gutters: {
      paddingLeft: '16px',
    },
    icons: {
      color: theme.palette.text.primary,
    },
    drawerClose: {
      border: '0px',
      backgroundColor: 'transparent',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(8) + 1,
      },
    },
    toolbar: {
      display: 'flex',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    text: {
      color: theme.palette.primary.main,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
  })
);

type Mainprops = {
  lightTheme: boolean;
  setTheme: any;
};
export default function MiniDrawer({ lightTheme, setTheme }: Mainprops) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const icon = !lightTheme ? <Brightness7 /> : <Brightness3 />;

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar elevation={0} position="fixed" className={clsx(classes.appBar)}>
        <Toolbar
          classes={{ gutters: classes.gutters }}
          className={classes.titlebar}
        >
          <h1 className={classes.text}>Kubhor</h1>

          <div></div>

          <div className={classes.titlebar}>
            <IconButton className={clsx(classes.menuButton)}>
              <Link to={routes.HOME} className={classes.menuButton}>
                <Icon></Icon>
              </Link>
            </IconButton>

            {/* <SvgIcon component={RSIcon} viewBox="0 0 600 476.6" /> */}
            <IconButton
              onClick={() => setTheme(!lightTheme)}
              className={clsx(classes.menuButton)}
            >
            <Link to={routes.HOME} className={classes.menuButton}>

              {icon}
              </Link>

            </IconButton>

            <IconButton className={clsx(classes.menuButton)}>
              <Link to={routes.HOME} className={classes.menuButton}>
                <SettingsIcon />
              </Link>
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          {/* <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton> */}
        </div>
        <List>
          <ListItem button key="test" onClick={() => setOpen(!open)}>
            <ListItemIcon className={classes.icons}>
              {open == true ? <ChevronLeftIcon /> : <ChevronRightIcon />}
            </ListItemIcon>
          </ListItem>

          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon className={classes.icons}>
                {' '}
                {index % 2 === 0 ? (
                  <Link to={routes.POD} className={classes.menuButton}>
                    <SettingsIcon />
                  </Link>
                ) : (
                  <MailIcon />
                )}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem button key={text}>
              <ListItemIcon className={classes.icons}>
                {index % 2 === 0 ? <Icon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route path={routes.POD} component={PodTable} />
          <Route path={routes.HOME} component={SettingsIcon} />
        </Switch>
      </main>
    </div>
  );
}

function Icon(props) {
  return (
    <SvgIcon {...props}>
      <svg width="24" height="24" version="1.1" viewBox="0 0 135.467 135.467">
        <path
          d="M8.805 103.54q-1.023 0-1.74-.716-.715-.716-.715-1.739V34.484q0-1.125.716-1.842.716-.716 1.74-.716h26.496q12.38 0 19.54 5.73 7.162 5.729 7.162 16.675 0 7.57-3.785 12.584-3.683 5.013-9.924 7.264l14.937 26.088q.307.613.307 1.125 0 .92-.716 1.535-.614.613-1.433.613h-9.31q-1.739 0-2.66-.92-.92-.921-1.432-1.842L34.791 76.532H20.57v24.553q0 1.023-.717 1.74-.614.715-1.739.715zM20.57 64.971h14.425q6.241 0 9.31-2.762 3.07-2.865 3.07-7.98t-3.07-7.98q-2.967-2.967-9.31-2.967H20.57z"
          style={{
            textAlign: 'center',
          }}
          strokeWidth="0.265"
          fontFamily="Rubik"
          fontSize="102.306"
          fontStretch="normal"
          fontStyle="normal"
          fontVariant="normal"
          fontWeight="500"
          textAnchor="middle"
        ></path>
        <path
          d="M100.062 104.564q-9.515 0-15.96-2.763-6.343-2.864-9.719-7.366-3.274-4.604-3.478-9.617 0-.92.614-1.534.613-.614 1.534-.614h9.105q1.33 0 1.944.614.716.511 1.228 1.33.614 1.944 2.353 3.887 1.74 1.842 4.706 3.07 3.07 1.227 7.673 1.227 7.366 0 10.947-2.455 3.683-2.455 3.683-6.65 0-2.967-1.944-4.706-1.944-1.842-6.036-3.274-3.99-1.534-10.64-3.171-7.673-1.842-12.89-4.4-5.116-2.66-7.776-6.65-2.557-3.99-2.557-10.128 0-5.933 3.171-10.537 3.274-4.604 9.208-7.264 6.036-2.66 14.322-2.66 6.65 0 11.766 1.842 5.115 1.739 8.491 4.706 3.376 2.864 5.115 6.24 1.842 3.274 1.944 6.446 0 .818-.614 1.534-.511.614-1.534.614h-9.515q-.818 0-1.637-.41-.818-.408-1.33-1.534-.613-3.171-3.99-5.422-3.376-2.25-8.696-2.25-5.524 0-8.9 2.045-3.376 2.047-3.376 6.343 0 2.865 1.637 4.809 1.739 1.841 5.422 3.274 3.785 1.432 9.923 3.069 8.696 1.944 14.221 4.501 5.525 2.558 8.082 6.548 2.558 3.887 2.558 9.924 0 6.752-3.683 11.56-3.58 4.706-10.128 7.264t-15.244 2.558z"
          style={{
            textAlign: 'center',
          }}
          strokeWidth="0.265"
          fontFamily="Rubik"
          fontSize="102.306"
          fontStretch="normal"
          fontStyle="normal"
          fontVariant="normal"
          fontWeight="500"
          textAnchor="middle"
        ></path>
      </svg>
    </SvgIcon>
  );
}
