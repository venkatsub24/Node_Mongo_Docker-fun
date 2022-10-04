import express, { Router } from "express";

import controller from "../controller/Book";

const router: Router = express.Router();

router.post("/create", controller.createBook);
router.get("/get/:bookId", controller.getBook);
router.get("/get", controller.getAllBook);
router.patch("/update/:bookId", controller.updatedBook);
router.delete("/delete/:bookId", controller.deleteBook);

export = router;
