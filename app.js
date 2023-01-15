const express = require("express");
const app = express();
const crypto = require("crypto");
const fs = require("fs");

const port = 3000;

app.use(express.json());

let products = [];

fs.readFile("products.json", "utf-8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    products = JSON.parse(data);
  }
});

app.get("/products", (req, res) => {
  res.json(products);
});

app.get("/products/:id", (req, res) => {
  const { id } = req.params;
  const product = products.find((product) => product.id === id);
  if (product) {
    res.send(product);
  } else {
    res.send(`There is no product using the id ${id}.`);
  }
});

app.post("/products", (req, res) => {
  const { name, price } = req.body;
  const id = crypto.randomUUID();
  const product = { name, price, id };

  products.push(product);

  productFile();

  res.json(`The product ${product.name} has been added.`);
});

app.put("/products/:id", (req, res) => {
  const { id } = req.params;
  const { name, price } = req.body;

  const productIndex = products.findIndex((product) => product.id === id);
  products[productIndex] = {
    ...products[productIndex],
    name,
    price,
  };

  productFile();
  res.send(200, "The product was updated.");
});

app.delete("/products/:id", (req, res) => {
  const { id } = req.params;
  const index = products.findIndex((product) => product.id === id);
  products.splice(index, 1);

  productFile();

  res.json(200, "Product deleted.");
});

const productFile = () => {
  fs.writeFile("products.json", JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("The product has been inserted.");
    }
  });
};

app.listen(port, () => {
  console.log(`Server is running in port ${port}.`);
});
