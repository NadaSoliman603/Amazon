const express = require("express");
const router = express.Router();
const Products = require("../models/product");
const multer = require("multer");

const MINE_TYPE_MAP = {
  "image/png": "png",
  "image/jepg": "jepg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cd) => {
    const isValid = MINE_TYPE_MAP[file.mimetype];
    let error = new Error("inValid mime type");
    if (isValid) {
      error = null;
    }
    cd(null, "backend/puplic/img");
  },
  filename: (req, file, cd) => {
    const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
    const ext = MINE_TYPE_MAP[file.mimetype];
    //console.log(mimetype)
    cd(null, name + "-" + Date.now() + "." + "jpg");
  },
});

router.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-width, productDiscription-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH, DELETE, OPTIONS"
  );
  next();
});

// add Product
router.post(
  "/",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const product = req.body;
    const url = req.protocol + "://" + req.get("host");
    const products = new Products({
      ProductName: req.body.ProductName,
      productDiscription: req.body.productDiscription,
      imagePath: url + "/puplic/img/"+ req.file.filename
    });
    // res.send(product)
    console.log(Products);
    products.save().then((result) => {
      console.log(result); //Products was created
      res.status(201).json({
        message: "Products Add succssfully",
        product: {
          ...result,
          _id: result._id,
        },
      });
    });
  }
);

// get Product
router.get("/", (req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const ProductsQuary = Products.find();
  let feachedProducts;
  if (pageSize && currentPage) {
    ProductsQuary.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  ProductsQuary.then((data) => {
    feachedProducts = data;
    return Products.countDocuments();
  }).then((count) => {
    res.status(200).json({
      product: feachedProducts,
      maxproduct: count,
    });
  });
});



router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/puplic/img/" + req.file.filename;
    }
    const product = new Products({
      _id: req.body._id,
      imagePath: imagePath,
      ProductName: req.body.ProductName,
      productDiscription: req.body.productDiscription,
    });

    Products.updateOne({ _id: req.params.id }, product).then((result) => {
      console.log(result);
      res.status(200).json({
        message: "updated successfully!",
        product: {
          ...result,
          _id: result._id,
        },
      });
    });
  }
);

///////////////////////////////////////////////////////////////////////

router.get("/:id", (req, res, next) => {
  Products.findById(req.params.id).then((product) => {
    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json("product not fond");
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Products.deleteOne({ _id: req.params.id }).then((result) => {
    console.log(result);
  });
  res.status(200).json("Products deleted");
});

module.exports = router;
