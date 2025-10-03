import { Router } from "express";
import { SignatureController } from "../controllers/signatureController";

const router = Router();
const signatureController = new SignatureController();

// POST /verify-signature - Verify a message signature
router.post("/verify-signature", signatureController.verifySignature);

export default router;
