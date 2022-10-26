import express from "express";

const router = express.Router();

console.log("test");

router.get("/dummy-route", (req, res, next) => {});

export default router;
