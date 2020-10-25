import React, { useState, useEffect } from "react";
import { Theme, makeStyles, createStyles, ThemeProvider, darken } from '@material-ui/core/styles';
import Main from './Main'
import {lightpalette, darkpalette} from '../lib/theme'
import { createMuiTheme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      textAlign: 'center',
      paddingTop: theme.spacing(4),
    },
  })
);

const Home = () => {
  const classes = useStyles({});
   const [lighttheme, setTheme] = useState(true)
   const appliedTheme = createMuiTheme(lighttheme ? lightpalette : darkpalette)
  //  const wave = darken(appliedTheme.palette.background.default,0.05)
  //  const wave2 = darken(appliedTheme.palette.background.default,0.1)
  //  const wave3 = darken(appliedTheme.palette.background.default,0.2)
   const wave = darken(appliedTheme.palette.background.default,0.05)
   const wave2 = darken(appliedTheme.palette.background.default,0.1)
   const wave3 = darken(appliedTheme.palette.background.default,0.2)

  return (
    <ThemeProvider theme={appliedTheme}>
    <Main lightTheme={lighttheme} setTheme={setTheme}></Main>
    <footer style={{ zIndex:"-1", position:"fixed",bottom:"0",left:"0",width:"100%",margin:"0px",padding:"0px",marginTop:"-50px", border:"none !important"}}>
        <svg xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1440 320">
            <path fill={wave} fillOpacity="1" d="M0,64L40,80C80,96,160,128,240,138.7C320,149,400,139,480,117.3C560,96,640,64,720,48C800,32,880,32,960,26.7C1040,21,1120,11,1200,10.7C1280,11,1360,21,1400,26.7L1440,32L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
          <path fill={wave2} fillOpacity="1" d="M0,96L48,133.3C96,171,192,245,288,282.7C384,320,480,320,576,266.7C672,213,768,107,864,85.3C960,64,1056,128,1152,138.7C1248,149,1344,107,1392,85.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z">  </path>
          <path fill={wave3}  fillOpacity="1" d="M0,160L40,181.3C80,203,160,245,240,234.7C320,224,400,160,480,154.7C560,149,640,203,720,208C800,213,880,171,960,128C1040,85,1120,43,1200,48C1280,53,1360,107,1400,133.3L1440,160L1440,320L1400,320C1360,320,1280,320,1200,320C1120,320,1040,320,960,320C880,320,800,320,720,320C640,320,560,320,480,320C400,320,320,320,240,320C160,320,80,320,40,320L0,320Z"></path>
          </svg>
        </footer>
    </ThemeProvider>
  )
};

export default Home;
