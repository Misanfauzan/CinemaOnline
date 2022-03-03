const express = require("express");

const router = express.Router();

// Controller
const { getTransactions, addTransaction, getTransactionsUser, updateTransactionApproved, updateTransactionCancel, getTransactionsId, getTransactionsUserFilm } = require("../controllers/transaction");
const { getFilms, getFilm, addFilm, getFilmsLimit } = require("../controllers/film");
const { getCategories,  getCategory, addCategory,  } = require("../controllers/category");
const { getUsers, getUser, updateUser } = require("../controllers/user");
const { register, login, checkAuth } = require("../controllers/auth");

// Middleware
const { auth } = require("../middlewares/auth");
const { uploadFile } = require("../middlewares/uploadFile");

// Route

router.post("/register", register);
router.post("/login", login);
router.get("/check-auth", auth, checkAuth);

router.get("/categories", auth, getCategories);
router.get("/category/:id", auth, getCategory);
router.post("/category", auth, addCategory);

router.post("/film", uploadFile('image'), addFilm);
router.get("/films", getFilms);
router.get("/film", getFilmsLimit);
router.get("/film/:id", auth, getFilm);

router.patch("/user", auth, uploadFile('image'), updateUser);
router.get("/users", auth, getUsers);
router.get("/user", auth, getUser);

router.post("/transaction", auth,uploadFile('image'), addTransaction);
router.patch("/transaction-approved",uploadFile('image'), updateTransactionApproved);
router.patch("/transaction-cancel",uploadFile('image'), updateTransactionCancel);
router.get("/transaction", auth, getTransactions);
router.get("/transaction-user", auth, getTransactionsUser);
router.get("/transaction-user/:id", auth, getTransactionsUserFilm);
router.get("/transaction-id", auth, getTransactionsId);

module.exports = router;
