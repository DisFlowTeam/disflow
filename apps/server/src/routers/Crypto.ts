import { Router } from "express";
import { createSeed } from "../encryption/encryption";

const router = Router();

// Bridge OAUTH2 and GUN's SEA
router.get("/seed", (req, res) => {
    if(!req.session.user) {
        res.status(401).json({
            message: "Login with Discord first",
            status: 401
        })
        return;
    }

    const seed = createSeed(req.session.user.id);

    res.json({
        seed,
        userId: req.session.user.id
    })
});

export default router;