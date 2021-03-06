// The button that allows a user to toggle the privacy of a particular project

import React, { Component } from "react";
import axios from "axios";
import { Container, Form } from "react-bootstrap";
import ProjectLink from "./ProjectLink";
//import Switch from "react-bootstrap/esm/Switch";

class PrivacyToggleButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      projectId: this.props.match.params.projectId,
      public: false,
    };
    console.log("State of Toggle Button" + JSON.stringify(this.state));
  }

  componentDidMount() {
    const projectId = this.props.match.params.projectId;
    console.log(projectId);
    axios.get(`/api/project/${projectId}`).then((response) => {
      const project = response.data;
      this.setState({
        public: project.itemIsPublic,
      });
    });
  }

  // Send a request to the database to switch the itemIsPublic bool
  onToggleClick = (e) => {
    //console.log("Button Clicked with id: " + projectId);
    this.setState({
      public: !this.state.public,
    });
    axios
      .post(`/api/project/togglePrivacy/${this.state.projectId}`, {
        public: this.state.public,
      })
      .then((response) => {
        console.log("Response:", response);
        if (response.error) {
          console.log("failure");
          console.log(response.error);
        } else {
          //console.log("Button Clicked with id: " + projectId);
          console.log("itemIsPublic is now " + response.data);
          //console.log(this.state.projects);
        }
      });
  };

  render() {
    return (
      <Container>
        <Form.Group controlId="switch">
          <Form.Check
            type="switch"
            id="switch"
            label={this.state.public ? "Public" : "Private"}
            onChange={this.onToggleClick}
            checked={this.state.public}
          />
        </Form.Group>
        <ProjectLink {...this.state} />
      </Container>
    );
  }
}

export default PrivacyToggleButton;
