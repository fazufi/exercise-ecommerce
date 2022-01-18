import React, { Component } from "react";
import { Col, Button, Row, Form } from "react-bootstrap";

export default class Tenis extends Component {
  state = {
    players: [
      { name: "", point: 0, status: "" },
      { name: "", point: 0, status: "" },
    ],
    lastScoring: "",
    started_at: "",
    all: JSON.parse(localStorage.getItem("all")) || [],
  };
  reset = () => {
    this.setState({
      players: [
        { name: "", point: 0, status: "" },
        { name: "", point: 0, status: "" },
      ],
    });
  };
  submit = async (e) => {
    const { players, all, started_at } = this.state;
    if (players[0].name === "") {
      e.preventDefault();
      players[0].name = e.target.player1.value;
      players[1].name = e.target.player2.value;

      await this.setState({ started_at: new Date(), players });
    } else {
      await all.push({
        player1: players[0],
        player2: players[1],
        started_at,
        finished_at: new Date(),
      });

      await localStorage.setItem("all", JSON.stringify(all));
    }
  };
  score1 = (e) => {
    const { players, lastScoring } = this.state;
    this.setState({ lastScoring: "player1" });
    if (players[0].point < 30) {
      players[0].point = players[0].point + 15;
    } else if (lastScoring === "player1" && players[1].status === "") {
      players[0].status = "WIN";
      players[0].point = 40;
    } else if (players[1].point === 40 && players[1].status === "") {
      players[0].point = 40;
      players[0].status = "DEUCE";
      players[1].status = "DEUCE";
    } else if (players[0].status === "DEUCE" && players[1].status === "DEUCE") {
      players[0].status = "ADVANTAGE";
      players[1].status = "";
    } else if (players[0].status === "ADVANTAGE") {
      players[0].status = "WIN";
      players[1].status = "";
    } else if (players[1].status === "ADVANTAGE") {
      players[0].status = "TIED";
      players[1].status = "TIED";
      // players[0].status = "DEUCE";
      // players[1].status = "DEUCE";
    } else {
      players[0].point = 40;
    }
    if (players[0].status === "WIN") {
      this.submit();
    }

    this.setState({ players });
  };
  score2 = (e) => {
    const { players, lastScoring } = this.state;
    this.setState({ lastScoring: "player2" });
    if (players[1].point < 30) {
      players[1].point = players[1].point + 15;
    } else if (lastScoring === "player2" && players[0].status === "") {
      players[1].status = "WIN";
      players[1].point = 40;
    } else if (players[0].point === 40 && players[0].status === "") {
      players[1].point = 40;
      players[1].status = "DEUCE";
      players[0].status = "DEUCE";
    } else if (players[1].status === "DEUCE" && players[0].status === "DEUCE") {
      players[1].status = "ADVANTAGE";
      players[0].status = "";
    } else if (players[1].status === "ADVANTAGE") {
      players[0].status = "";
      players[1].status = "WIN";
    } else if (players[0].status === "ADVANTAGE") {
      players[1].status = "TIED";
      players[0].status = "TIED";
      // players[1].status = "DEUCE";
      // players[0].status = "DEUCE";
    } else {
      players[1].point = 40;
    }
    if (players[1].status === "WIN") {
      this.submit();
    }
    this.setState({ players });
  };

  render() {
    const { players } = this.state;

    return (
      <div>
        <h1 className="d-flex justify-content-center">TENNIS SCORING</h1>
        {players[0].name === "" && (
          <h6 className="text-danger">TYPE PLAYERS NAME BEFORE PLAYING!!!</h6>
        )}
        <Form onSubmit={this.submit}>
          <Row>
            <Col>
              {players[0].name === "" && (
                <Form.Control
                  style={{ width: 500 }}
                  className="mx-auto"
                  name="player1"
                  type="text"
                  placeholder="player1"
                />
              )}
              {players[0].name !== "" && (
                <div className="mx-5 text-center">
                  <h4>{players[0].name}</h4>
                  <h1>{players[0].point}</h1>
                  <h6>
                    {players[0].point === 0 && "love"}
                    {players[0].point === 15 && "fifteen"}
                    {players[0].point === 30 && "thirty"}
                    {players[0].point === 40 && "fourty"}
                  </h6>
                  <h2>{players[0].status}</h2>
                  <Button onClick={this.score1}>point</Button>
                </div>
              )}
            </Col>
            <Col className="mx-auto">
              {players[1].name === "" && (
                <Form.Control
                  name="player2"
                  style={{ width: 500 }}
                  className="mx-auto"
                  type="text"
                  placeholder="player2"
                />
              )}
              {players[1].name !== "" && (
                <div className="mx-5 text-center">
                  <h4>{players[1].name}</h4>
                  <h1>{players[1].point}</h1>
                  <h6>
                    {players[1].point === 0 && "love"}
                    {players[1].point === 15 && "fifteen"}
                    {players[1].point === 30 && "thirty"}
                    {players[1].point === 40 && "fourty"}
                  </h6>
                  <h2>{players[1].status}</h2>
                  <Button onClick={this.score2}>point</Button>
                </div>
              )}
            </Col>
          </Row>

          {players[0].name === "" && (
            <Button className="mx-auto d-block" variant="primary" type="submit">
              Submit
            </Button>
          )}
          {players[1].name !== "" && (
            <Button onClick={this.reset} className="mx-auto d-block">
              RESET
            </Button>
          )}
        </Form>
      </div>
    );
  }
}
