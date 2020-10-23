import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Card, Container, Col, Row, Alert, Spinner } from "react-bootstrap";
import axios from "axios";

import ProjectList from "./ProjectList";
import { getUsernameId } from "../layout/GetUsername";
import { Loading } from "../loading/Loading";
import DisplayCarousel from "../profile/Carousel";
import { HCenter } from "../layout";

class Profile extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profileUserName: this.props.match.params.username,
      firstName: "",
      lastName: "",
      email: "",
      userExists: true,
      phoneNumberExists: true,
      userId: this.props.auth.user._id,
      projects: [],
      projectExists: true,
      aboutUserExists: true,
      aboutUser: "",
      photoExist: false,
      isAuth: false,
      loading: true,
      emptyString: "",
      emailPrivate: true,
      phoneNumberPrivate: true,
    };
  }

  componentDidMount = () => {
    getUsernameId(this.state.userId).then((data) => {
      if (data === this.state.profileUserName)
        this.setState({
          isAuth: true,
        });
    });

    axios
      .get(`/api/user/profile/${this.props.match.params.username}`)
      .then((response) => {
        if (response.error) {
          console.log(response.error);
        } else if (response.data.message === "Profile does not exist") {
          this.setState({
            userExists: false,
            photoExist: response.data.photoExist,
            loading: false,
          });
        } else {
          this.setState({
            firstName: response.data.firstName,
            lastName: response.data.lastName,
            email: response.data.email,
            phoneNumber: response.data.phoneNumber,
            aboutUser: response.data.aboutUser,
            photoExist: response.data.photoExist,
            loading: false,
            emailPrivate: response.data.emailPrivate,
            phoneNumberPrivate: response.data.phoneNumberPrivate,
          });

          //console.log(this.state);

          if (this.state.phoneNumber === "") {
            this.setState({
              phoneNumberExists: false,
            });
          } else if (this.state.aboutUser === "") {
            this.setState({
              aboutUser: false,
            });
          }
        }
      });

    axios
      .post(`/api/project/list`, { username: this.state.profileUserName })
      .then((response) => {
        if (response.error) {
          console.log("failure");
          console.log(response.error);
        } else if (response.data.message === "Projects do not exist") {
          console.log("response:", response);
          this.setState({
            projectExists: false,
            loading: false,
          });
        } else {
          console.log("response:", response);
          this.setState({
            projects: Array.from(response.data),
            loading: false,
          });
        }
      });
  };

  render() {
    if (this.state.loading) {
      return <Loading />;
    } else if (this.state.userExists) {
      return (
        <div>
          {this.state.loading ? (
            <HCenter>
              <Spinner animation="grow" size="lg" />
            </HCenter>
          ) : (
            <Row>
              {this.state.projects.length > 0 && (
                <DisplayCarousel
                  className="mt-3 mb-5"
                  projects={this.state.projects}
                  projectExists={this.state.projectExists}
                ></DisplayCarousel>
              )}
              <Col className="col-sm d-flex ml-4 ">
                <div>
                  <Card style={{ width: "20rem", height: 350 }}>
                    <Container className="d-flex justify-content-center">
                      {this.state.photoExist ? (
                        <Card.Img
                          src={`/api/user/${this.state.profileUserName}/photo`}
                          style={{ width: 200, height: 200 }}
                        />
                      ) : (
                        <Card.Img
                          src="../../default_photo.png"
                          style={{ width: 200, height: 200 }}
                        />
                      )}
                    </Container>
                    <Card.Body>
                      <Card.Title>
                        {this.state.firstName} {this.state.lastName}
                      </Card.Title>
                      <Card.Subtitle>
                        {this.state.emailPrivate ? "" : "Email:"}
                      </Card.Subtitle>
                      <Card.Text>{this.state.email}</Card.Text>
                      <Card.Subtitle>
                        {this.state.phoneNumberPrivate ? "" : "Phone Number:"}
                      </Card.Subtitle>
                      <Card.Text>{this.state.phoneNumber}</Card.Text>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
              <Col className="col-sm d-flex">
                <div>
                  <Card style={{ width: "20rem" }}>
                    <Card.Header>About</Card.Header>
                    <Card.Body style={{ overflowY: "scroll", height: 299 }}>
                      {this.state.aboutUserExists
                        ? this.state.aboutUser
                        : " None"}
                    </Card.Body>
                  </Card>
                </div>
              </Col>
              <ProjectList
                projects={this.state.projects}
                projectExists={this.state.projectExists}
                username={this.state.profileUserName}
                isAuth={this.state.isAuth}
              ></ProjectList>
            </Row>
          )}
          ;
        </div>
      );
    } else {
      return (
        <Container>
          <Alert variant="warning">
            <Alert.Heading>User doesn't exist</Alert.Heading>
            <Alert.Link href="/">Go Home</Alert.Link>
          </Alert>
        </Container>
      );
    }
  }
}

Profile.propTypes = {
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(Profile);
