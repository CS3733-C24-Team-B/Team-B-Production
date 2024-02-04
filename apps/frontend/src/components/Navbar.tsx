import React from 'react';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, TextField } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

// Define FloorImages type
type FloorImages = {
    groundfloor: string;
    lowerlevel1: string;
    lowerlevel2: string;
    firstfloor: string;
    secondfloor: string;
    thirdfloor: string;
};

const FloorLevel =  [
    {
        floor: "groundfloor",
        level: "0"
    },
    {
        floor: "lowerlevel1",
        level: "L1"
    },
    {
        floor: "lowerlevel2",
        level: "L2"
    },
    {
        floor: "firstfloor",
        level: "1"
    },
    {
        floor: "secondfloor",
        level: "2"
    },
    {
        floor: "thirdfloor",
        level: "3"
    }
];

interface NavbarProps {
    handleFloorChange: (floor: keyof FloorImages, level: string) => void;
    filterFunction: (event: React.ChangeEvent<HTMLInputElement>) => void; // Update the type to accept an event
    selectedFloor: keyof FloorImages;
}

const Navbar: React.FC<NavbarProps> = ({ handleFloorChange, filterFunction, selectedFloor }) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const floorToLevel = (inputFloor:string) => {
        let output = "0";
        FloorLevel.map(({floor, level}) => {
            if(inputFloor === floor) {
                output = level;
            }
        });
        return output;
    };

    const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <AppBar position="static">
            <Toolbar >
                <IconButton
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    onClick={handleMenu}
                >
                    <MenuIcon />
                </IconButton>
                <Menu
                    id="menu-appbar"
                    anchorEl={anchorEl}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={open}
                    onClose={handleClose}
                >
                    <MenuItem>
                        <a href="/home">Home</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/csvnodedata">Node Data</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/csvedgedata">Edge Data</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/requestform">Service Request Form</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/requestlist">List of Service Requests</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/home">View Profile</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/settings">Settings</a>
                    </MenuItem>
                    <MenuItem>
                        <a href="/">Log Out</a>
                    </MenuItem>
                </Menu>
                {/* Search bar */}
                <div style={{ flexGrow: 1, marginRight: 'auto' }}>
                    <TextField
                        onChange={filterFunction} // Updated event handler to filterFunction
                        placeholder="Search.."
                        variant="outlined"
                        size="small"
                    />
                </div>
                {/* Floor selection dropdown */}
                <div>
                    <TextField
                        select
                        value={selectedFloor}
                        onChange={(event) => {
                            handleFloorChange(event.target.value as keyof FloorImages, floorToLevel(event.target.value));
                        }}
                        variant="outlined"
                        size="small"
                    >
                        <MenuItem value="lowerlevel1">Lower Level 1</MenuItem>
                        <MenuItem value="lowerlevel2">Lower Level 2</MenuItem>
                        <MenuItem value="groundfloor">Ground Floor</MenuItem>
                        <MenuItem value="firstfloor">First Floor</MenuItem>
                        <MenuItem value="secondfloor">Second Floor</MenuItem>
                        <MenuItem value="thirdfloor">Third Floor</MenuItem>
                    </TextField>
                </div>
            </Toolbar>
        </AppBar>
    );
};
export default Navbar;
