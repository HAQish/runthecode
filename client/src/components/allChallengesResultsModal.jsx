import React from "react";
import TestResultsList from "./testResultsList.jsx";
import SolutionList from "./SolutionList.jsx";
import { Modal, Button, Header, Icon, List } from "semantic-ui-react";

const AllChallengesResultsModal = props => {
  var showFailure = props.msg === "Failure";
  var showSuccess = props.msg === "Success";
  var showError = props.msg === "Error";
  var showTests = showSuccess || showFailure;
  var failButtons = (showError || showFailure);
  var solutionButton = (
    <Button color="green" onClick={props.viewSolutions}>
      View other solutions <Icon name="arrow right" />
    </Button>
  )
  var retryButton = (
    <Button color="green" onClick={props.closeResultsModal}>
      Retry <Icon name="arrow right" />
    </Button>
  );
  return (
    <React.Fragment>
      <Modal.Content>
        {props.showSolutions && (
          <Modal.Description>
            <SolutionList
              solutions={props.solutions}
              challengeName={props.challengeName}
            />
          </Modal.Description>
        )}
        {showError && (
          <Modal.Description>
            <Header inverted size={"large"} style={{color:"red"}}>Failed tests</Header>
            <Header inverted>Error: {props.testResults}</Header>
          </Modal.Description>
        )}
        {showFailure && (
          <Modal.Description>
            <Header size={"large"} inverted dividing style={{color:"red"}}>Failed</Header>
            <Header sub></Header>
          </Modal.Description>
        )}
        {showSuccess && (
          <Modal.Description>
            <Header inverted size={"large"} style={{color:"green"}}>Success!</Header>
            <Header sub></Header>
          </Modal.Description>
        )}
        {showTests && (
          <Modal.Description>
            <List divided inverted relaxed>
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
        </Modal.Actions>
      )}
      {showSuccess && <Modal.Actions>{solutionButton}</Modal.Actions>}
    </React.Fragment>
  );
};

export default AllChallengesResultsModal;
