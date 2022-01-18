import React, { Component } from "react";
import axios from "axios";
import { API_URL, formatter } from "./helpers";

import {
  Col,
  Row,
  Navbar,
  Container,
  Nav,
  NavDropdown,
  ListGroup,
  Card,
  Button,
} from "react-bootstrap";
import Troley from "./Troley";
import { connect } from "react-redux";

class App extends Component {
  state = {
    Product: [],
    Categories: [],
    selectedCategory: "",
  };
  async componentDidMount() {
    await axios.get(API_URL + "categories").then(async (res) => {
      await this.setState({
        Categories: res.data,
        selectedCategory: res.data[0].nama,
      });
    });
    axios.get(API_URL + "products").then((res) => {
      this.setState({
        Product: res.data,
      });
    });
  }
  handleUpdate=()=>{
    axios.get(API_URL+ "troley").then((res)=>{
      this.props.setTroley(res.data)
    })
  }

  selectCategory = (p) => {
    this.setState({ selectedCategory: p });
  };

  pickUp = async (item) => {
    let isThere;
    let data;
    await axios
      .get(API_URL + `troley?product.id=${item.id}`)
      .then(async (res) => {
        [isThere] = await res.data;
      });

    if (!isThere) {
      data = {
        jumlah: 1,
        total_harga: item.harga,
        product: item,
      };
      axios.post(API_URL + "troley", data).then(()=> this.handleUpdate())
      
    } else {
      const jumlah = isThere.jumlah + 1;
      const total_harga = isThere.total_harga + isThere.product.harga;

      axios.put(API_URL + `troley/${isThere.id}`, {
        ...isThere,
        jumlah,
        total_harga,
      }).then(()=> this.handleUpdate())
    }
  };
  render() {
    const { Product, Categories, selectedCategory } = this.state;

    return (
      <div>
        <Navbar bg="warning" expand="lg" className="mb-2">
          <Container>
            <Navbar.Brand href="#home"> E-COMMERCE</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="#home">Home</Nav.Link>
                <Nav.Link href="#link">Link</Nav.Link>
                <NavDropdown title="Dropdown" id="basic-nav-dropdown">
                  <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.2">
                    Another action
                  </NavDropdown.Item>
                  <NavDropdown.Item href="#action/3.3">
                    Something
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">
                    Separated link
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
        <Container fluid>
          <Row>
            <Col md={2}>
              <h4>DAFTAR PRODUK</h4>
              <hr />
              <ListGroup as="ul">
                {Categories.map((item, i) => (
                  <ListGroup.Item
                    as="li"
                    onClick={() => this.selectCategory(item.nama)}
                    className={item.nama === selectedCategory && "bg-success"}
                    style={{ cursor: "pointer" }}
                  >
                    {item.nama}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Col>
            <Col md={7}>
              <h4>MENU</h4>
              <hr />
              <Row>
                {Product.filter(
                  (itemP) => itemP.category.nama === selectedCategory
                ).map((item, i) => (
                  <Col md={3} xs={6} className="mt-3">
                    <Card className="h-100 ">
                      <Card.Img
                        variant="top"
                        src={`images/${item.gambar}`}
                        alt="Product"
                      />
                      <Card.Body>
                        <Card.Title>{item.nama}</Card.Title>
                        <Card.Text>{formatter(item.harga)}</Card.Text>
                       
                       
                      </Card.Body>
                      <Card.Footer >
                        <Button
                          variant="primary"
                          onClick={() => this.pickUp(item)}
                        >
                          pick up
                        </Button></Card.Footer>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Col>
           <Troley handleUpdate={this.handleUpdate} />
          </Row>
        </Container>
      </div>
    );
  }
}



const mapDispatchToProps = (dispatch) => {
  return {
    setTroley: (troley) => dispatch({ type: "setTroley", troley }),
  };
};

export default connect (null, mapDispatchToProps)(App);