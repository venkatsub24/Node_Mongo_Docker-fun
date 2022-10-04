import express, { Router } from "express";

import controller from "../controller/Author";

const router: Router = express.Router();

router.post("/create", controller.createAuthor);
router.get("/get/:authorId", controller.getAuthor);
router.get("/get", controller.getAllAuthor);
router.patch("/update/:authorId", controller.updatedAuthor);
router.delete("/delete/:authorId", controller.deleteAuthor);

export = router;
