import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import ListItemText from '@material-ui/core/ListItemText';
import ListItem from '@material-ui/core/ListItem';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import Slide from '@material-ui/core/Slide';
import { TransitionProps } from '@material-ui/core/transitions';
import { V1Pod } from '@kubernetes/client-node/dist/gen/model/v1Pod';
import CodeIcon from '@material-ui/icons/Code';
const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      position: 'relative',
    },
    dialog: {
      borderRadius: "5px"
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  }),
);

type PodPopupProps = {
  pod: V1Pod,
  open: boolean,
  handleClose: any
}

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement },
  ref: React.Ref<unknown>,
) {
  return <Slide ref={ref} {...props}/>;
});

export default function FullScreenDialog({pod,open,handleClose}:PodPopupProps) {
  if (pod===undefined) return ( <div></div>)
  const classes = useStyles();
  console.log(pod)
 
  const shpod = (pod: V1Pod) => {
    if(pod===undefined || pod.metadata ===undefined) return false
    if(pod.metadata.name===undefined || pod.metadata.namespace==undefined) return false
    let params = new URLSearchParams();
     params.append("name", pod.metadata.name);
     params.append("namespace", pod.metadata.namespace);
     var url = "/api/pod-shell?" + params.toString();
    fetch(url)
    return true
  }

  return (
    <div>
      <Dialog className={classes.dialog}  fullWidth={true} maxWidth={"xl"} open={open} onClose={handleClose} TransitionComponent={Transition}>
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
            {pod.metadata?.name}
            </Typography>
            <IconButton edge="start" color="inherit" onClick={()=>shpod(pod)} aria-label="close">
              <CodeIcon></CodeIcon>
            </IconButton>
            
           
          </Toolbar>
        </AppBar>
        <List>
          <ListItem button>
            <ListItemText primary="Phone ringtone" secondary="Titania" />
          </ListItem>
          <Divider />
          <ListItem button>
            <ListItemText primary="Default notification ringtone" secondary="Tethys" />
          </ListItem>
        </List>
      </Dialog>
    </div>
  );
}
