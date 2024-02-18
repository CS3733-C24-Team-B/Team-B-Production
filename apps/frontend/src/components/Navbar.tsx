import * as React from 'react';
import {styled} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import TimelineIcon from '@mui/icons-material/Timeline';
import SettingsIcon from '@mui/icons-material/Settings';
// import HomeIcon from '@mui/icons-material/Home';
import logo from "../images/BandW-Logo-White.png";
//MaterialUI icons
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import NavigationIcon from '@mui/icons-material/Navigation';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
const drawerWidth = 240;

const icons = [<AccountCircleIcon/>, <AdminPanelSettingsIcon/>];
const links = ['/profile-info', '/admin-viewer'];

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

const adminIcons = [<NavigationIcon/>, <InboxIcon/>, <InboxIcon/>, <ScatterPlotIcon/>, <TimelineIcon/>,
    <SettingsIcon/>];
const adminLinks = ['/', '/requestform', '/requestlist', '/csvnodedata', '/csvedgedata', '/settings'];

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

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
    fontFamily: 'Lato, sans-serif', //Changed font to Lato
}));

export default function PersistentDrawerLeft() {
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleHomeClick = () => {
        window.location.href = "/home"; // Redirect to home page
    };

    return (
        <ThemeProvider theme={theme}> {/* Apply the Lato font theme */}
            <Box sx={{display: 'block', position: 'fixed', width: '4%', zIndex: '1002'}}>
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
                        // onMouseEnter={handleDrawerOpen} //opens navbar when hovered
                        onMouseClick={handleDrawerOpen} //opens navbar when clicked
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
                        style={{color: 'white', position: 'fixed', top: '60px'}}
                    >
                        <NavigationIcon/>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white', position: 'fixed', top: '120px'}}
                    >
                        <AccountCircleIcon/>
                    </IconButton>

                </Toolbar>

                {/*When navbar is OPENED*/}<Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        // backgroundColor: 'green',
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                            backgroundColor: '#012d5a',
                            fontFamily: 'Lato, sans-serif', //font
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                    onMouseEnter={handleDrawerOpen}
                    onMouseLeave={handleDrawerClose}
                >
                    <DrawerHeader>
                        <a href="/home">
                            <img src={logo} alt="Hospital Logo" width={"100%"}/>
                        </a>
                    </DrawerHeader>
                    <Divider/>
                    <List
                        sx={{
                            color: 'white',
                        }}
                    >
                        {['Profile', 'Admin'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton component="a" href={links[index]}>
                                    <ListItemIcon
                                        sx={{
                                            color: 'white',
                                        }}
                                    >
                                        {icons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List
                        sx={{
                            color: 'white',
                        }}
                    >
                        {['Profile','Navigation', 'Service Requests', 'Admin','Settings'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton component="a" href={adminLinks[index]}>
                                    <ListItemIcon
                                        sx={{
                                            color: 'white',
                                        }}
                                    >
                                        {adminIcons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                </Drawer>
            </AppBar>
            </Box>
        </ThemeProvider>

    );
}
