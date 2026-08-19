import express from  'express'
import { register } from 'node:module';
const router=express.Router()
router.post("/register", register)

export default router;