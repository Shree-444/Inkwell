import { Hono } from "hono";
import userRouter from "./user";
import blogRouter from "./blog";
import reactionRouter from "./reactions"
import geminiRouter from "./gemini"

const mainRouter = new Hono()

mainRouter.route('/user', userRouter)
mainRouter.route('/blog', blogRouter)
mainRouter.route('/reaction', reactionRouter)
mainRouter.route('/gemini', geminiRouter)

export default mainRouter