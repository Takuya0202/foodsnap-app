import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { createUserSchema } from "../schema/user";

export const userApp = new Hono().basePath('/user')
.post('/register' , zValidator( 'json' , createUserSchema) , async (c) => {
    
})