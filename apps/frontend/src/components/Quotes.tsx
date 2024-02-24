import React from "react";
import AananImage from "../images/profiles/AananGoyal.png";
import CameronImage from "../images/profiles/CameronCrane.png";
import HienImage from "../images/profiles/HienPham.png";
import KatieImage from "../images/profiles/KatieKartsen.png";
import KatyImage from "../images/profiles/KatyStuparu.png";
import KennyImage from "../images/profiles/KennyDoan.png";
import LuisImage from "../images/profiles/LuisAlzamora.png";
import MichaelImage from "../images/profiles/MichaelSensat.png";
import PiotrImage from "../images/profiles/PiotrSkoczylas.png";
import RodrickImage from "../images/profiles/RodrickMoore.png";
import "../css/about_page.css";
import {Box, Button, Modal, Typography} from "@mui/material";
import PregnantWomanIcon from "@mui/icons-material/PregnantWoman";


const style = {
    position: 'absolute',// as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxshadow: 24,
    p: 4,
};

export function KatyQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={KatyImage}
                                          alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Katy's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "This might be sneaky difficult" -Cameron Crane
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function MichaelQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={MichaelImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Michael's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "Quote" -PersonA
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function KatieQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={KatieImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Kaitlin's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "One can have no smaller or greater mastery than mastery of oneself." -Leonardo da Vinci
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function HienQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={HienImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Hien's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "Quote" -PersonB
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function AananQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={AananImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Aanan's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "Quote" -PersonC
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function CameronQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={CameronImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Cameron's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "We cannot direct the wind, but we can adjust the sails" -Jimmy Dean
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function KennyQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={KennyImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Kenny's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        <PregnantWomanIcon/>
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function LuisQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={LuisImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Luis's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "Sickness is a mindset." -Luis Alzamora
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function RodrickQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={RodrickImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Rodrick's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "Goku and I'm just getting started" -Ice Spice
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

export function PiotrQuote() {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    return (
        <React.Fragment>
            <Button onClick={handleOpen}><img className={"ProfilePicture"} src={PiotrImage}
                                              alt="profile picture"/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby={"modal-modal-titleKaty"}
                aria-describedby={"modal-modal-descriptionKaty"}>
                <Box sx={style}>
                    <Typography id={"modal-modal-titleKaty"} variant={"h6"} component={"h2"}>
                        Piotr's Favorite Quote:
                    </Typography>
                    <Typography id={"modal-nodal-descriptionKaty"} sx={{ mt: 2 }}>
                        "Quote" -PersonD
                    </Typography>
                </Box>
            </Modal>
        </React.Fragment>
    );
}

