import * as React from 'react';
import {styled, useTheme} from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar, {AppBarProps as MuiAppBarProps} from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/Inbox';
import MailIcon from '@mui/icons-material/Mail';
import SettingsIcon from '@mui/icons-material/Settings';
import LanguageIcon from '@mui/icons-material/Language';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import ScatterPlotIcon from '@mui/icons-material/ScatterPlot';
import TimelineIcon from '@mui/icons-material/Timeline';
import HomeIcon from '@mui/icons-material/Home';
import LogoutIcon from '@mui/icons-material/Logout';
import logo from "../images/Brigham_and_Womens_Hospital_horiz_rgb.png";

const drawerWidth = 240;

const icons = [<InboxIcon/>, <MailIcon/>, <SettingsIcon/>, <LanguageIcon/>];
const links = ['/requestform', '/saved-locations', '/mapsettings', '/language'];
const adminIcons = [<AccountBoxIcon/>, <InboxIcon/>, <ScatterPlotIcon/>, <TimelineIcon/>, <LogoutIcon/>];
const adminLinks = ['/profile-info', '/requestlist', '/csvnodedata', '/csvedgedata', '/login'];

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
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

export default function PersistentDrawerLeft() {
    const theme = useTheme();
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
        <Box sx={{ display: 'flex', flexDirection: 'column', }}>
            <CssBaseline/>
            <AppBar position="relative" open={open} sx={{
                zIndex: theme.zIndex.drawer + 1, // keeps icons centered when screen size changes
                backgroundColor: '#012d5a', //Background color
            }}>
                <Toolbar style={{
                    backgroundColor: "#012d5a", //Background color
                    flexDirection: 'column', //makes it so icons are displayed vertically
                    alignItems: 'center',
                    width: `calc(100% - ${drawerWidth}px)`, //slightly shifts icons to left
                    height: '10000px', //makes navbar go all the way down. technically max height of 10000px
                }}>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={{ml:0.08, mt:1,...(open && {display: 'none'})}}
                        style={{marginBottom: '3px'}} // Add margin to separate the icons
                    >
                        <MenuIcon/>
                    </IconButton>
                    <IconButton
                        color="inherit"
                        aria-label="home"
                        onClick={handleHomeClick}
                        style={{color: 'white'}}
                    >
                        <HomeIcon/>
                    </IconButton>
                </Toolbar>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={open}
                >
                    <DrawerHeader >
                        <a href="/home">
                            <img src={logo} alt="Hospital Logo" width={"100%"}/>
                        </a>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
                        </IconButton>
                    </DrawerHeader>
                    <Divider/>
                    <List>
                        {['Create Request', 'Saved Locations', 'Map Settings', 'Language'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton component="a" href={links[index]}>
                                    <ListItemIcon>
                                        {icons[index]}
                                    </ListItemIcon>
                                    <ListItemText primary={text}/>
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </List>
                    <Divider/>
                    <List>
                        {['Profile', 'View Service Requests', 'CSV Node Data', 'CSV Edge Data', 'Logout'].map((text, index) => (
                            <ListItem key={text} disablePadding>
                                <ListItemButton component="a" href={adminLinks[index]}>
                                    <ListItemIcon>
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
    );
}
