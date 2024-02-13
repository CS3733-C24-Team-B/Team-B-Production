import React from 'react';
import {Box} from '@mui/material';
import {styled} from '@mui/material/styles';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

interface RequestCarouselProps {
    children: React.ReactNode[];
}

const RequestCarouselContainer = styled(Box)(() => ({
    overflow: 'hidden',
    position: 'relative',
    width: '96%',
    padding: '1%',
}));

const RequestCarouselWrapper = styled(Box)(() => ({
    display: 'flex',
    width: '50%',
    alignSelf: 'start',
    alignContent: 'center',
}));

const SlideContainer = styled(Box)({
    flex: '0 0 auto',
    width: '50%',
});

const PrevNextButton = styled(Button)(() => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
    backgroundColor: 'white',
    color: '#012d5a',
    width: '1vw',
}));

const PrevButton = styled(PrevNextButton)({
    left: '4.5%',
});

const NextButton = styled(PrevNextButton)({
    left: '96.2%',
});

const PositionIndicators = styled(Box)({
    display: 'flex',
    position: 'relative',
    top: '20%',
    width: '100%', // Full width
    left: '44.25%',
});

const IndicatorDot = styled(Box)(({isActive}: boolean) => ({
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    margin: '0 10px',
    backgroundColor: isActive ? "lightgrey" : "grey",
    cursor: 'pointer',
}));

const RequestCarousel: React.FC<RequestCarouselProps> = ({children}) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);
    const totalSlides = 2; // Total number of slides

    const handleNext = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setActiveIndex((prevIndex) => (prevIndex === totalSlides - 1 ? 0 : prevIndex + 1));
        }
    };

    const handlePrev = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setActiveIndex((prevIndex) => (prevIndex === 0 ? totalSlides - 1 : prevIndex - 1));
        }
    };

    const handleTransitionEnd = () => {
        setIsAnimating(false);
    };

    const slideStyle = {
        transform: `translateX(-${activeIndex * 50}%)`,
        transition: isAnimating ? 'transform 0.5s ease' : 'none',
    };

    return (
        <div style={{width: '90vw'}}>
            <PrevButton onClick={handlePrev}>
                <ArrowBackIcon />
            </PrevButton>
            <NextButton onClick={handleNext}>
                <ArrowForwardIcon />
            </NextButton>

            <RequestCarouselContainer>
                <RequestCarouselWrapper style={slideStyle} onTransitionEnd={handleTransitionEnd}>
                    {React.Children.map(children, (child, index) => (
                        <SlideContainer key={index}>
                            {child}
                        </SlideContainer>
                    ))}
                </RequestCarouselWrapper>
            </RequestCarouselContainer>

            <PositionIndicators>
                {[...Array(totalSlides)].map((_, index) => (
                    <IndicatorDot
                        key={index}
                        isActive={index === activeIndex}
                        onClick={() => setActiveIndex(index)}
                    />
                ))}
            </PositionIndicators>
        </div>
    );
};

export default RequestCarousel;
