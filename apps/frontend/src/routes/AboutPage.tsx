import React, { useState, useEffect } from "react";
import AboutUsImage from "../images/AboutUsImage.png";
import TempNavbar from "../components/TempNavbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/about_page.css";
import Box from "@mui/material/Box";
import {IconButton} from "@mui/material";
import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import Slide from "@mui/material/Slide";
import Stack from "@mui/material/Stack";
import Card from "../components/card.tsx";

// let slideIndex = 1;
// showSlides(slideIndex);

{/*function plusSlides(n: number) {
    showSlides(slideIndex += n);
}*/}

{/*function currentSlide(n: number) {
    showSlides(slideIndex = n);
}*/}

// function showSlides(n: number) {
//     {/*let i;*/}
//     const slides = document.getElementsByClassName("TeamMember");
//     const dots = document.getElementsByClassName("dot");
//     if (n > slides.length) {slideIndex = 1;}
//     if (n < 1) {slideIndex = slides.length;}
//     {/*for(i = 0; i < slides.length; i++) {
//         slides[i].style.display = "none";
//     }
//     for(i = 0; i < dots.length; i++) {
//         dots[i].className = dots[i].className.replace(" active", "");
//     }
//     slides[slideIndex-1].style.display = "block";*/}
//     dots[slideIndex-1].className += " active";
// }

export default function AboutPage() {

    const [cards, setCards] = useState<React.ReactElement[]>([]);
    const [currentPage, setCurrentPage] = useState(0);
    const[slideDirection, setSlideDirection] = useState<
        "right" | "left" | undefined
    >("left");

    const cardsPerPage = 2;
    const duplicateCards: React.ReactElement[] = Array.from(
        {length: 10},
        (_, i) => <Card key={i} />
    );

    const handleNextPage = () => {
        setSlideDirection("left");
        setCurrentPage((prevPage) => prevPage + 1);
    };

    const handlePrevPage = () => {
        setSlideDirection("right");
        setCurrentPage((prevPage) => prevPage - 1);
    };

    useEffect(() => {
        setCards(duplicateCards);
    }, [duplicateCards]);

    return (
        <div className={"AboutContainer"}> {/* expands area across entire screen */}
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}> {/* divides area below topbar into navbar and main space */}
                <div className={"FiveRows"}>
                    <div className={"about-header"}>About Us</div>
                    <div className={"AboutTwoColumns"}>
                        <div className={"LabelCard"}>
                            <p className={"break"}>.</p>
                            <p className={"welcome-text"}>WPI Computer</p> <p className={"welcome-text"}>Science
                            Department</p>
                            <p className={"break"}>.</p>
                            <p className={"course-info"}>CS3733-C24</p> <p className={"course-info"}>Software
                            Engineering</p>
                            <p className={"break"}>.</p>
                            <p className={"course-info"}>Professor</p> <p className={"name"}>Wilson Wong</p>
                            <p className={"break"}>.</p>
                            <p className={"course-info"}>Team Coach</p> <p className={"name"}>Ariel Schechter</p>
                            <p className={"break"}>.</p>
                        </div>
                        <div className={"TestCard"}>
                            <img className={"AboutImage"} src={AboutUsImage} alt={"Image"} />
                        </div>
                    </div>
                    <div className={"MeetTheTeam"}>
                        <p className={"meet-text"}>Meet the Team</p>
                        <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                                height: "400px", }}>
                        <IconButton
                            onClick={handlePrevPage}
                            sx={{margin: 5,}}
                            disabled={currentPage === 0}>
                            <NavigateBeforeIcon />
                        </IconButton>
                            <Box sx={{
                                display: "flex",
                                flexDirection: "row",
                                alignItems: "center",
                                alignContent: "center",
                                justifyContent: "center",
                                height: "400px", }}>
                                {cards.map((card, index) => (
                                    <Box
                                    key={`card-${index}`}
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        display: currentPage === index ? "block" : "none",
                                    }}>
                                        <Slide direction={slideDirection} in={currentPage === index}>
                                            <Stack
                                                spacing={2}
                                                direction={"row"}
                                                alignContent={"center"}>
                                                {cards.slice(
                                                    index * cardsPerPage,
                                                    index * cardsPerPage + cardsPerPage
                                                )}
                                            </Stack>
                                        </Slide>
                                    </Box>
                                ))}
                            </Box>
                            <IconButton onClick={handleNextPage} sx={{
                                margin: 5,}}
                                        disabled={
                                currentPage >= Math.ceil((cards.length || 0) / cardsPerPage) - 1
                                        }>
                                <NavigateNextIcon />
                            </IconButton>
                        </Box>
                        {/*<div className={"TeamMember"}>*/}
                        {/*    <div className={"Picture1"}> insert person image</div>*/}
                        {/*    <div className={"TeamText"}>*/}
                        {/*        <p className={"name"}> insert name here </p>*/}
                        {/*        <p className={"position"}> insert position(s) here </p>*/}
                        {/*        <p className={"info"}> insert info here </p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className={"Slideshow"}>*/}
                        {/*    <div className={"TeamMember"}>*/}
                        {/*        <div className={"Picture1"}> insert person image</div>*/}
                        {/*        <div className={"TeamText"}>*/}
                        {/*            <p className={"name"}> insert name here </p>*/}
                        {/*            <p className={"position"}> insert position(s) here </p>*/}
                        {/*            <p className={"info"}> insert info here </p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                        {/*    <div className={"TeamMember"}>*/}
                        {/*        <div className={"Picture2"}> insert person image</div>*/}
                        {/*        <div className={"TeamText"}>*/}
                        {/*            <p className={"name"}> insert name here </p>*/}
                        {/*            <p className={"position"}> insert position(s) here </p>*/}
                        {/*            <p className={"info"}> insert info here </p>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                            {/*<a className={"prev"} onClick={plusSlides(-1)}>&#10094;</a>
                            <a className={"next"} onClick={plusSlides(1)}>&#10095;</a>*/}
                        </div>
                        <br/>
                    </div>
                    <div className={"AcknowledgementCard"}>
                        <p className={"meet-text"}>Acknowledgements</p>
                        <p className={"info"}>help{/*Brigham and Women's Hospital, and representative </p> <p className={"blue-info"}>Andrew Shinn</p>
                        <p className={"info"}>Icon made by </p> <p className={"blue-info"}>Freepik</p> <p className={"info"}> from www.flaticon.com*/}</p>
                    </div>
                    <div className={"CopyrightCard"}>
                        <p className={"copyright-text"}>The Brigham & Women’s Hospital maps and data used in this
                            application are copyrighted and provided for the sole use of educational purposes.</p>
                        <p className={"date"}>Created in 2023</p>
                    </div>
                </div>
            </div>
    );

}

