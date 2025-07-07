import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { createblogInput, updateblogInput } from "@shree444/medium-common";
import { Hono } from "hono";
import { verify } from "hono/jwt";

const router = new Hono<{
    Variables: {
        userId: number
    },
    
    Bindings: {
        DATABASE_URL: string,
        SECRET_KEY: string,
        prisma: any
    }
    
    
}>()

//auth middleware
router.use('/*', async(c, next) => {
    
    try{
        const auth = c.req.header('Authorization') || ''
        const token = auth.split(' ')[1]
        if (!token) {
            return c.json({ msg: 'unauthorized: token missing' })
        }

        const user = await verify(token, c.env.SECRET_KEY) as {id: number}
        if (!user?.id) {
            return c.json({ msg: 'unauthorized: invalid token' })
        }

        c.set("userId", user.id)
        await next()
    }
    catch(err){
        console.error('error: ', err)
        return c.json({
            msg: 'authorization failed',
            error: err
        })
    }
})

router.post('/', async(c) => {
    
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())
    
        const body = await c.req.json()
        const authorId = c.get('userId')

        const blogBody = createblogInput.safeParse(body)

        if(!blogBody.success){
            return c.json({
                msg: 'wrong inputs for blog creation'
            })
        }
        
        const newBlog = await prisma.blog.create({
            data: {
                title: blogBody.data?.title || "",
                content: blogBody.data?.content || "",
                authorId           
            }
        })

        return c.json({
            msg: 'new blog has been posted',
            newBlog
        })
    } catch(err){
        console.error('error: ', err)
        return c.json({
            msg: 'blog creation failed'
        })
    }
})

router.put('/:id/update', async(c) => {
    
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const body = await c.req.json()
        const blogId = c.req.param('id')

        const blogBody = updateblogInput.safeParse(body)

        if(!blogBody.success){
            c.json({
                msg: 'wrong inputs for blog updation'
            })
        }

        const updateBlog = await prisma.blog.update({
            
            where:{
                id: parseInt(blogId)
            },
            data: {
                title: blogBody.data?.title,
                content: blogBody.data?.content
            }
        })
        return c.json({
            msg: 'blog has been updated',
            updatedBlog: updateBlog
        })

    } catch(err){
        console.error('error is: ', err)
        return c.json({
            msg: 'updation of blog failed'
        })
    }
})

//add pagination
router.get('/bulk', async(c) => {
    
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const filter = c.req.query('filter') || ''
        
        if(filter.length > 0){
            const filteredBlogs = await prisma.blog.findMany({
                where: {
                    OR: [{
                        title: {
                            contains: filter,
                            mode: 'insensitive'
                        }
                    },{
                        author: {
                            name: {
                                contains: filter,
                                mode: 'insensitive'
                            }
                        }
                    }]
                },
                include: {
                    author: {select: {name: true}}
                },
                orderBy: {
                    created_at: 'desc'
                }
            })
            return c.json({
                filteredBlogs
            })
        }
        else{
            const blogs = await prisma.blog.findMany({
                orderBy: {
                    created_at: "desc"
                },
                include: {
                    author: {
                        select: {
                            name: true
                        }
                    }
                }
            })

            return c.json({
                blogs
            })
        }
    } catch(err){
        console.error('error is: ', err)
        return c.json({
            msg: 'showing of blogs failed'
        })
    }
})

router.get('/:id', async(c) => {
    
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const blogId = c.req.param('id')

        const blog = await prisma.blog.findFirst({
            where: {
                id: Number(blogId)
            },
            include: {
                author: {
                    select: {
                        name: true,
                        bio: true
                    }
                }
            }
        })

        if(!blog){
            return c.json({
                msg: 'requested blog does not exist'
            })
        }

        return c.json({
            blog
        })
    } catch(err){
        console.error('error is: ', err)
        return c.json({
            msg: 'blog show failed'
        })
    }
})

router.get('/getBlogs/:authorId', async(c) => {

    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const authorId = c.req.param('authorId')

        const [author, blogs] = await Promise.all([

            prisma.user.findUnique({
                where: {
                    id: parseInt(authorId)
                },
                select: {
                    name: true,
                    bio: true,
                    created_at: true,
                    city: true,
                    id: true
                }
            }),

            prisma.blog.findMany({
                where: {
                    authorId: parseInt(authorId)
                },
                select: {
                    title: true,
                    content: true,
                    created_at: true,
                    id: true
                },
                orderBy: {
                    created_at: 'desc'
                }
            })
        ])
        if(!author){
            return c.json({
                msg: 'author not found'
            })
        }

        return c.json({
            author,
            blogs
        })
    }catch(e){
        c.json({
            msg: 'internal error'
        })
    }
})

router.delete('/:id', async (c) => {
    try {
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const blogId = Number(c.req.param('id'))
        const userId = c.get('userId')

        const existingBlog = await prisma.blog.findUnique({
            where: { id: blogId }
        })

        if (!existingBlog || existingBlog.authorId !== userId) {
            return c.json({ msg: 'Blog not found or unauthorized' })
        }

        await prisma.blog.delete({
            where: { id: blogId }
        })

        return c.json({ msg: 'Blog deleted successfully' })
    } catch (err) {
        console.error('error:', err)
        return c.json({ msg: 'Failed to delete blog' })
    }
})

export default router