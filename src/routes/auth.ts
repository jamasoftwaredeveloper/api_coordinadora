import { Router } from "express";
import { createAccount, loginAccount, getUser, updateUser, uploadImage } from "../handlers";
import { validateBodyAuth } from "../middlewares/auth/registerValidation";

const router = Router();

//routing

router.post("/api/auth/register", validateBodyAuth.register, createAccount); // GET request
router.post("/api/auth/login", validateBodyAuth.login, loginAccount); // GET request
router.get("/api/auth/getUser", validateBodyAuth.authorization, getUser); // GET request
router.patch("/api/auth/updateUser", validateBodyAuth.updateUser, updateUser); 
router.post("/api/auth/uploadImageUser/image", validateBodyAuth.authorization, uploadImage); 

export default router;
