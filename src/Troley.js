import axios from "axios";
import React, { Component } from "react";
import {
  Badge,
  Card,
  Col,
  ListGroup,
  Row,
  Modal,
  Button,
  Form,
} from "react-bootstrap";
import { connect } from "react-redux";
import { API_URL, formatter } from "./helpers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComments } from "@fortawesome/free-solid-svg-icons";

class Troley extends Component {
  state = {
    show: false,
    product: null,
    amount: {},
    total: 0,
  };
  componentDidMount() {
    axios.get(API_URL + "troley").then((res) => {
      this.props.setTroley(res.data);
    });
  }
  handleShow = async (p) => {
    const { troley } = this.props;
    await this.setState({
      show: true,
      product: troley[p],
      amount: troley[p].jumlah,
      total: troley[p].total_harga,
    });
  };
  handleClose = () => {
    this.setState({ show: false });
  };
  handlePlus = async () => {
    const { total, amount, product } = this.state;
    await this.setState({
      amount: amount + 1,
      total: total + product.product.harga,
    });
  };
  handleMin = async () => {
    const { total, amount, product } = this.state;
    await this.setState({
      amount: amount - 1,
      total: total - product.product.harga,
    });
  };
  handleSubmit = (e) => {
    e.preventDefault();
    this.handleClose();
    const { product, amount, total } = this.state;
    axios
      .put(API_URL + `troley/${product.id}`, {
        ...this.state.product,
        jumlah: amount,
        total_harga: total,
        description: e.target.desc.value,
      })
      .then(() => this.props.handleUpdate());
  };
  handleRemove=()=>{
    this.handleClose()
    axios.delete(API_URL + `troley/${this.state.product.id}`).then(()=> this.props.handleUpdate())
  }

  render() {
    const { show, product, amount, total } = this.state;
    const { troley } = this.props;
    // console.log(troley);

    return (
      <Col>
        <Row>
          <Col>
            <h4>TROLEY </h4>
          </Col>
          <Col>
           <h4><FontAwesomeIcon icon={faComments} /></h4> 
          </Col>
        </Row>

        <hr />
        {troley.map((item, i) => (
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item onClick={() => this.handleShow(i)}>
                <Row>
                  <Col>
                    <h4>
                      <Badge pill bg="success">
                        {item.jumlah}
                      </Badge>
                    </h4>
                  </Col>
                  <Col>
                    <h5>{item.product.nama}</h5>
                    <p>{item.product.harga}</p>
                  </Col>
                  <Col>
                    <strong>{item.total_harga}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
        <Modal show={show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              {product?.product.nama}
              <strong>{formatter(product?.product.harga)}</strong>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.handleSubmit}>
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Total Harga :</Form.Label>
                <p>
                  <strong>{total}</strong>
                </p>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Jumlah :</Form.Label>
                <br />
                <Button
                  onClick={this.handleMin}
                  variant="primary"
                  size="sm"
                  className="mr-2"
                >
                  -
                </Button>

                <strong>{amount}</strong>

                <Button
                  onClick={this.handlePlus}
                  variant="primary"
                  size="sm"
                  className="ml-2"
                >
                  +
                </Button>
              </Form.Group>

              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Keterangan :</Form.Label>
                <Form.Control
                  as="textarea"
                  rows="3"
                  name="desc"
                  placeholder="Contoh : Pedes, Nasi Setengah"
                />
              </Form.Group>
              <Button variant="primary" type="submit">
                Simpan
              </Button>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleRemove} variant="danger">Hapus Pesanan</Button>
          </Modal.Footer>
        </Modal>
      </Col>
    );
  }
}

const mapStateToProps = ({ troley }) => {
  return { troley };
};

const mapDispatchToProps = (dispatch) => {
  return {
    setTroley: (troley) => dispatch({ type: "setTroley", troley }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Troley);
