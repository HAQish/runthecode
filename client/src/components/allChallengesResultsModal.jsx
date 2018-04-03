import React from "react";
import TestResultsList from "./testResultsList.jsx";
import { Modal, Button, Header, Icon, List } from "semantic-ui-react";

const ChallengeResultsModal = props => {
  var showInitialCompletionResults = props.justCompletedInitial;
  var startingLevel = props.initialScore;
  var showFailure = props.msg === "Failure";
  var showSuccess = props.msg === "Success";
  var showError = props.msg === "Error";
  var showTests = showSuccess || showFailure;
  var failButtons = (showError || showFailure) && !showInitialCompletionResults;
  var successButtons = showSuccess && !showInitialCompletionResults;
  var nextButton = successButtons ? (
    <Button color="green" onClick={props.nextChallenge}>
      Next Challenge <Icon name="arrow right" />
    </Button>
  ) : (
    <Button color="red" onClick={props.nextChallenge}>
      Skip <Icon name="arrow right" />
    </Button>
  );
  var retryButton = (
    <Button color="green" onClick={props.closeResultsModal}>
      Retry <Icon name="arrow right" />
    </Button>
  );
  return (
    <React.Fragment>
      <Modal.Content>
        {showInitialCompletionResults && (
          <Modal.Description>
            <Header inverted>
              Congrats! You have completed the placement challenges!
            </Header>
            <Header inverted>You have earned level: {startingLevel}</Header>
            <Header inverted>
              Click Begin Course to start at a recommended challenge
            </Header>
          </Modal.Description>
        )}
        {showError && (
          <Modal.Description>
            <Header inverted>Failed tests</Header>
            <Header inverted>Error: {props.testResults}</Header>
          </Modal.Description>
        )}
        {showFailure && (
          <Modal.Description>
            <Header inverted>Failed</Header>
          </Modal.Description>
        )}
        {showSuccess && (
          <Modal.Description>
            <Header inverted>Success!</Header>
          </Modal.Description>
        )}
        {showTests && (
          <Modal.Description>
            <List divided relaxed>
              {props.testResults.map((value, i) => (
                <TestResultsList
                  val={value}
                  i={i}
                  description={props.testDescriptions}
                />
              ))}
            </List>
          </Modal.Description>
        )}
      </Modal.Content>
      {failButtons && (
        <Modal.Actions>
          {retryButton}
          {nextButton}
        </Modal.Actions>
      )}
      {successButtons && <Modal.Actions>{nextButton}</Modal.Actions>}
      {showInitialCompletionResults && (
        <Modal.Actions>
          <Button color="green" onClick={props.nextChallenge}>
            Begin Course <Icon name="arrow right" />
          </Button>
        </Modal.Actions>
      )}
    </React.Fragment>
  );
};

export default ChallengeResultsModal;
