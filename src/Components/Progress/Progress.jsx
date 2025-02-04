import React from 'react'
import { ProgressBar } from 'react-bootstrap';
const Progress = ({ currentStep, totalStep }) => {
    const progress = (currentStep / totalStep) * 100;
    return (
        <>
            <ProgressBar now={progress} label={`Step ${currentStep} of ${totalStep}`} className="mb-3" />
        </>
    )
}

export default Progress