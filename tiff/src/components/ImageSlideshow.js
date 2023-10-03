import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import SwipeableViews from 'react-swipeable-views';
import { autoPlay } from 'react-swipeable-views-utils';
import img1 from "../resources/images/117081835_10160396504093747_6748433467455386540_n.jpg";
import img2 from "../resources/images/117109348_10160392218268747_1013672368395513790_n.jpg";
import img3 from "../resources/images/117415098_10160419269898747_18793843162069354_n.jpg";
import img4 from "../resources/images/117445190_10160417865378747_573948945185811326_n.jpg";
import img5 from "../resources/images/157095099_252905816393161_2856147652351866792_n.jpg";
import '../stylesheets/FrontPageBody.scss'

const AutoPlaySwipeableViews = autoPlay(SwipeableViews);

const tutorialSteps = [
  {
    label: 'Film Universitatea Babeș-Bolyai - TIFF 2020',
    imgPath: img1,
  },
  {
    label: 'Concerte la Muzeul de Artă - TIFF 2020 1',
    imgPath: img2,
  },
  {
    label: 'Concerte la Muzeul de Artă - TIFF 2020 2',
    imgPath: img3,
  },
  {
    label: 'Gala de închidere TIFF 2020 1',
    imgPath: img4,
  },
  {
    label: 'Gala de închidere TIFF 2020 2',
    imgPath: img5,
  },
];

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    position: "relative",
  },
  img: {
    height: 'calc(100vh - 69px);',
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    objectFit: 'cover',
  },
  positionStatic: {
    bottom: "0%",
    position: "absolute",
  },
  dot: {
    backgroundColor: "rgba(255, 255, 255, 0)",
  },
}));

function SwipeableTextMobileStepper() {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(0);
  const maxSteps = tutorialSteps.length;

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <div className={classes.root} style={{ position: 'absolute'}}>
      <AutoPlaySwipeableViews
        axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
        index={activeStep}
        onChangeIndex={handleStepChange}
        enableMouseEvents
      >
        {tutorialSteps.map((step, index) => (
          <div key={step.label}>
            {Math.abs(activeStep - index) <= 2 ? (
              <img className={classes.img} src={step.imgPath} alt={step.label} />
            ) : null}
          </div>
        ))}
      </AutoPlaySwipeableViews>
      <MobileStepper
        className={`${classes.positionStatic} ${classes.dot}`}
        steps={maxSteps}
        position="static"
        variant="dots"
        activeStep={activeStep}
        style={{ paddingLeft: "calc(50% - 30px)"}}
      />
    </div>
  );
}
  
const ImageSlideshow = () => {
    return (
        <SwipeableTextMobileStepper/>
    )
}

export default ImageSlideshow;