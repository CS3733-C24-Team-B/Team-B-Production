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
    width: '100%',
}));

const RequestCarouselWrapper = styled(Box)(() => ({
    display: 'flex',
    width: '40%',
}));

const SlideContainer = styled(Box)({
    flex: '0 0 auto',
    width: '100%',
});

const PrevNextButton = styled(Button)(() => ({
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    zIndex: 1,
}));

const PrevButton = styled(PrevNextButton)({
    left: '-1%',
});

const NextButton = styled(PrevNextButton)({
    left: '86%',
});

const RequestCarousel: React.FC<RequestCarouselProps> = ({children}) => {
    const [activeIndex, setActiveIndex] = React.useState(0);
    const [isAnimating, setIsAnimating] = React.useState(false);

    const handleNext = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setActiveIndex((prevIndex) => (prevIndex === children.length - 1 ? 0 : prevIndex + 1));
        }
    };

    const handlePrev = () => {
        if (!isAnimating) {
            setIsAnimating(true);
            setActiveIndex((prevIndex) => (prevIndex === 0 ? children.length - 1 : prevIndex - 1));
        }
    };

    const handleTransitionEnd = () => {
        setIsAnimating(false);
    };

    const slideStyle = {
        transform: `translateX(-${activeIndex * 100}%)`,
        transition: isAnimating ? 'transform 0.5s ease' : 'none',
    };

    return (
        <RequestCarouselContainer>
            <PrevButton onClick={handlePrev}>
                <ArrowBackIcon />
            </PrevButton>
            <NextButton onClick={handleNext}>
                <ArrowForwardIcon />
            </NextButton>

            <RequestCarouselWrapper style={slideStyle} onTransitionEnd={handleTransitionEnd}>
                {React.Children.map(children, (child, index) => (
                    <SlideContainer key={index}>
                        {child}
                    </SlideContainer>
                ))}
            </RequestCarouselWrapper>
        </RequestCarouselContainer>
    );
};

export default RequestCarousel;
