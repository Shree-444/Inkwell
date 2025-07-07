import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { sign, verify } from "hono/jwt";
import { signinInput, signupInput, updateUserInput } from "@shree444/medium-common";
import bcrypt from 'bcryptjs'

const router = new Hono<{
    Variables: {
        userId: number
    },
    Bindings: {
        DATABASE_URL: string,
        SECRET_KEY: string,
        prisma: any,
    }
}>()

router.use('/profile/*', async(c, next) => {
    
    try{
        const auth = c.req.header('Authorization') || ''
        const token = auth.split(' ')[1]
        const user = await verify(token, c.env.SECRET_KEY) as {id: number}

        if(user){
            c.set("userId", user.id)
            await next()
        }
        else{
            return c.json({
                msg: 'unauthorized'
            })
    }
    }catch(err){
        console.error('error: ', err)
        return c.json({
            msg: 'authorization failed',
            error: err
        })
    }
})

router.post('/signup', async(c) => {
    
    try{
        const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())
    
    const body = await c.req.json()

    const userBody = signupInput.safeParse(body)

    if(!userBody.success){
        return c.json({
            msg: 'wrong inputs'
        })
    }

    const hashedPassword = await bcrypt.hashSync(userBody.data.password, 10)

    const existingUser = await prisma.user.findUnique({
        where: {
            email: userBody.data.email
        }
    })

    if(existingUser){
        return c.json({
            msg: 'user already exists'
        })
    }

    const createdUser = await prisma.user.create({
        data: {
            email: userBody.data.email,
            name: userBody.data.name,
            password: hashedPassword,
            city: userBody.data.city,
            bio: userBody.data.bio
        }
    })

    const payload = {
        id: createdUser.id
    }
    const secret = c.env.SECRET_KEY;
    if (!secret) {
        throw new Error("Missing SECRET_KEY in environment variables");
    }
    const token = await sign(payload, secret)

    return c.json({
        msg: 'user created successfully',
        user: createdUser,
        token: token
    
    })
    } catch(err){
        console.error('internal error: ', err)
        return c.json({
            msg: 'error occurred'
        })
        
    }

})

router.post('/signin', async(c) => {
    
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
    
        const body = await c.req.json()

        const userBody = signinInput.safeParse(body)

        if(!userBody.success){
            return c.json({
                msg: 'wrong inputs'
            })
        }

        const user = await prisma.user.findFirst({
            where: {
                email: userBody.data.email
            }
        })

        if(!user){
            return c.json({
                msg: 'bad credentials, user does not exist'
            })
        }

        const isPasswordCorrect = bcrypt.compareSync(userBody.data.password, user.password)
    
        if (!isPasswordCorrect) {
            return c.json({ 
                msg: 'Invalid credentials' 
            })
        }

        const token = await sign({id: user.id}, c.env.SECRET_KEY)
        
        return c.json({
            msg: 'sign in successful',
            token: token,
            user: user
        })
    }catch (err){
        console.error('internal error: ', err)
        return c.json({
            msg: 'error occurred',
        })
    }
})

router.put('/profile/update', async(c) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json()
        const userId = c.get("userId")

        const parsedBody = updateUserInput.safeParse(body)
        if (!parsedBody.success) {
            return c.json({ msg: 'Invalid input' })
        }

        const user = await prisma.user.findUnique({
            where: { id: userId }
        })
        if (!user) {
            return c.json({ msg: 'User not found' })
        }

        const updateData: any = {
            name: parsedBody.data.name,
            bio: parsedBody.data.bio,
            city: parsedBody.data.city
        }

        if(parsedBody.data.currentPassword && parsedBody.data.newPassword && parsedBody.data.confirmPassword){

            const isMatch = bcrypt.compareSync(parsedBody.data.currentPassword, user.password)
            if (!isMatch) {
                return c.json({ msg: 'Current password is incorrect' })
            }

            if (parsedBody.data.newPassword !== parsedBody.data.confirmPassword) {
                return c.json({ msg: 'New password and confirmation do not match' })
            }

            const hashedPassword = bcrypt.hashSync(parsedBody.data.newPassword, 10)
            updateData.password = hashedPassword
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: userId
            },
            data: updateData
        })
        return c.json({
            msg: 'user details have been updated',
            updatedUser: updatedUser
        })
    } catch(err){
        console.error('internal error: ', err)
        return c.json({
            msg: 'internal error'
        })
    }
})

router.get('/profile/me', async(c) => {

    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const userId = c.get('userId')

        const userDetails = await prisma.user.findUnique({
            where: {
                id: userId
            },
            omit: {
                id: true
            }
        })

        if(!userDetails){
            c.json({
                msg: 'user not found'
            })
            return
        }

        return c.json({
            msg: 'user found',
            user: userDetails
        })
    }catch(err){
        console.error('internal error: ', err)
        return c.json({
            msg: 'internal error'
        })
    }

})

export default router