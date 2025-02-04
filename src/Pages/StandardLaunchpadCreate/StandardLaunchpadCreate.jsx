import React, { useState, useEffect } from 'react';
import Step1 from '../../Components/StandardLaunchpadForms/Step1/Step1';
import Step2 from '../../Components/StandardLaunchpadForms/Step2/Step2';
import Step3 from '../../Components/StandardLaunchpadForms/Step3/Step3';
import Step4 from '../../Components/StandardLaunchpadForms/Step4/Step4';
import { Card, Form } from 'react-bootstrap';
import Progress from '../../Components/Progress/Progress';


const StandardLaunchpadCreate = () => {

  const [step, setStep] = useState(1);
  const [description, setDescription] = useState({});
  // console.log({description})
  const handleSubmit = () => { setStep(1) };

  return (
    <Card style={{ width: '100%', maxWidth: '1240px', margin: 'auto', marginTop: '50px', marginBottom: '50px' }}>
      <Card.Body className="formbox">
        <center><Card.Title>Create Launchpad</Card.Title></center>
        <Progress currentStep={step} totalStep={4} />
        <Form>
          {step === 1 && (
            <Step1
              setStep={setStep}
              description={description}
              setDescription={setDescription}
            />
          )}
          {step === 2 && (
            <Step2
              setStep={setStep}
              description={description}
              setDescription={setDescription}
            />
          )}
          {step === 3 && (
            <Step3
              setStep={setStep}
              description={description}
              setDescription={setDescription}
            />
          )}
          {step === 4 && (
            <>
              <Step4
                setStep={setStep}
                description={description}
                handleSubmit={handleSubmit}
              />
            </>
          )}
        </Form>
      </Card.Body>
    </Card>
  );
};

export default StandardLaunchpadCreate;
