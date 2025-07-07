import { Hono } from 'hono'
import mainRouter from '../routes/routes'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'

const app = new Hono()

app.use(cors())

app.route('/api/v1', mainRouter)

export default app
