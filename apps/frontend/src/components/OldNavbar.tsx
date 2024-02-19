import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
// import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';


//MaterialUI icons
import DesignServicesIcon from '@mui/icons-material/DesignServices';
import SettingsIcon from '@mui/icons-material/Settings';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NavigationIcon from '@mui/icons-material/Navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';



// Import Lato font
import {createTheme, ThemeProvider} from '@mui/material/styles';

// Define the theme with Lato font
const theme = createTheme({
    typography: {
        fontFamily: [
            'Lato',
            'sans-serif',
        ].join(','),
    },
});
interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({theme, open}) => ({
    transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.easeOut,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
    fontFamily: 'Lato, sans-serif', //Changed font to LAto
}));

export default function PersistentDrawerLeft() {
    const [open, setOpen] = React.useState(true);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleHomeClick = () => {
        window.location.href = "/home"; // Redirect to home page
    };

    return (
        <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
            <Box sx={{display: 'block', position: 'fixed', width: '10%', zIndex: '1002'}}>
                <CssBaseline/>
                {/*When navbar is CLOSED*/}<AppBar position="relative" open={open} sx={{boxShadow: 0,}}> {/*no shadow*/}
                <Toolbar style={{
                    backgroundColor: "#012d5a", //Background color
                    flexDirection: 'column', //makes it so icons are displayed vertically
                    minHeight: "100vh", //makes navbar go all the way down.
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onMouseEnter={handleDrawerOpen} //opens navbar when hovered
                        edge="start"
                        sx={{
                            ml: 0.075, //margin left
                            mt: 1.5, //margin top
                            ...(open && {display: 'none'})
                        }} //handles the opening properties
                        style={{marginBottom: '2px', position: 'fixed'}} // Add margin to separate the icons
                    >
                        <MenuIcon/>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '72px'}}
                    >
                        <AccountCircleIcon style={{ fontSize: '1.5rem' }}/>  {/*profile icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '125px'}}
                    >
                        <AdminPanelSettingsIcon style={{ fontSize: '1.9rem' }}/>  {/*admin icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '176px'}}
                    >
                        <NavigationIcon style={{ fontSize: '1.5rem' }}/>  {/*naviagtion icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '228px'}}
                    >
                        <DesignServicesIcon style={{ fontSize: '1.5rem' }}/>  {/*service request icon*/}
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '279px'}}
                    >
                        <SettingsIcon style={{ fontSize: '1.5rem' }}/>{/*settings icon*/}
                    </IconButton>
                </Toolbar>



            </AppBar>
            </Box>
        </ThemeProvider>

    );
}
