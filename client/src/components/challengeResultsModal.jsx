import React from 'react';
import {Link} from 'react-router-dom';
import TestResultsList from './testResultsList.jsx'; //filename will be caps when cleaned up
import {Modal, Button, Header, Icon, List} from 'semantic-ui-react';

//line 6 -> props as argument or destructure each prop in arguments?
export default function ChallengeResultsModal(props) {
  const showInitialCompletionResults = props.justCompletedInitial;
  const startingLevel = props.initialScore;
  const courseComplete = props.courseComplete;
  const showFailure = props.msg === "Failure";
  const showSuccess = props.msg === "Success";
  const showError = props.msg === "Error";
  const showTests = (showSuccess || showFailure);
  const failButtons = (showError || showFailure) && !showInitialCompletionResults && !courseComplete;
  const successButtons = showSuccess && !showInitialCompletionResults && !courseComplete;
  {/*nextButton vs retryButton indenting?*/}
  const nextButton = successButtons ? (
    <Button color="green" onClick={() => props.nextChallenge()}> {/*onClick like this or in red button?...also, Icon on next line?*/} 
      Next Challenge <Icon name="arrow right" />
    </Button>
  ) : (
    <Button color="red" onClick={props.nextChallenge}>
      Skip <Icon name="arrow right" />
    </Button>
  );
  const retryButton = (
    <Button color="green" onClick={props.closeResultsModal}>
      Retry <Icon name="arrow right" />
    </Button>
  );
  const completeButton = (
    <Button as={Link} to="/" content="Dashboard" color="green" onClick={props.nextChallenge} />
  )
{/*how to style conditional ifs like line 34-40(not in airbnb styleguide)
should modal description + header * end /modal description be one on line?*/}
  return (
    <React.Fragment>
      <Modal.Content>
        {showInitialCompletionResults &&
          <Modal.Description>
            <Header inverted>Congrats! You have completed the placement challenges!</Header>
            <Header inverted>You have earned level: {startingLevel}</Header>
            <Header inverted>Click Begin Course to start at a recommended challenge</Header>
          </Modal.Description>
        }
        {showError && 
          <Modal.Description>
            <Header inverted size={"large"} style={{color:"red"}}>Failed tests</Header>
            <Header inverted>Error: {props.testResults}</Header>
          </Modal.Description>
        }
        {showFailure && 
          <Modal.Description>
            <Header inverted size={"large"} dividing style={{color:"red"}}>Failed</Header>
            <Header sub></Header>
          </Modal.Description>
        }
        {showSuccess &&
          <Modal.Description>
            <Header inverted size={"large"} style={{color:"green"}}>Success!</Header>
            <Header sub></Header>
          </Modal.Description>
        }
        {showTests &&
          <Modal.Description>
            <List divided inverted relaxed>
              {props.testResults.map((value, i) =>
                <TestResultsList key={value.id} val={value} i={i} description={props.testDescriptions}/>)} 
            </List>
          </Modal.Description>
        }
      </Modal.Content>
        {failButtons &&
          <Modal.Actions>
            {retryButton}
            {nextButton}
          </Modal.Actions>
        }
        {successButtons &&
          <Modal.Actions>
            {nextButton}
          </Modal.Actions>
        }
        {courseComplete &&
          <Modal.Actions>
            {retryButton}
            {completeButton}
          </Modal.Actions>
        }
        {showInitialCompletionResults &&
          <Modal.Actions>
            <Button color='green' onClick={props.nextChallenge}>
              Begin Course <Icon name='arrow right' />
            </Button>
          </Modal.Actions>
        }
    </React.Fragment>
  )
}