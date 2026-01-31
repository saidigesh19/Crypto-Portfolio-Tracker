import express from 'express';
import  Holding  from "../model/Holding.js";
const router = express.Router()

router.post("/", async (req, res) => {
    const holding = await Holding.create(req.body);
    res.json(holding);
});


router.get("/:userId", async (req, res)=>{
    const holding = await Holding.find({ userId: req.params.userId } );
    res.json(holding);
});

export default router;