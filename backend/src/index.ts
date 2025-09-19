import { Hono } from 'hono'
import { userApp } from './routes/user'

const app = new Hono().basePath('/api')

app.route('/user' , userApp)


export default app
export type AppType = typeof app