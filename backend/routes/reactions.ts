import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono"
import { verify } from "hono/jwt";

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

router.post("/blog/:id/like", async (c) => {
  
  try{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const blogId = parseInt(c.req.param("id"));
    const userId = c.get("userId"); 

    const existing = await prisma.reaction.findUnique({
        where: { userId_blogId: { userId, blogId } },
    });

    if (existing?.type === "LIKE") {
        await prisma.reaction.delete({ where: { id: existing.id } });
    } 
    else if (existing?.type === "DISLIKE") {
        await prisma.reaction.update({
        where: { id: existing.id },
        data: { type: "LIKE" },
        });
    } 
    else {
        await prisma.reaction.create({
        data: { type: "LIKE", userId, blogId },
        });
    }

    return c.json({ success: true });
    }catch(e){
        console.error("internal error: ", e)
        return c.json({
            msg: 'error occurred'
        })
    }
});

router.post("/blog/:id/dislike", async (c) => {
  
  try{
    const prisma = new PrismaClient({
        datasourceUrl: c.env.DATABASE_URL
    }).$extends(withAccelerate())

    const blogId = parseInt(c.req.param("id"));
    const userId = c.get("userId"); 

    const existing = await prisma.reaction.findUnique({
        where: { userId_blogId: { userId, blogId } },
    });

    if (existing?.type === "DISLIKE") {
        await prisma.reaction.delete({ where: { id: existing.id } });
    } 
    else if (existing?.type === "LIKE") {
        await prisma.reaction.update({
        where: { id: existing.id },
        data: { type: "DISLIKE" },
        });
    } 
    else {
        await prisma.reaction.create({
        data: { type: "DISLIKE", userId, blogId },
        });
    }

    return c.json({ success: true });
    }catch(e){
        console.error("internal error: ", e)
        return c.json({
            msg: 'error occurred'
        })
    }
});

router.get('/blog/:id/count', async(c) => {
    try{
        const prisma = new PrismaClient({
            datasourceUrl: c.env.DATABASE_URL
        }).$extends(withAccelerate())

        const blogId = parseInt(c.req.param('id'))
        const userId = c.get('userId')

        const likes = await prisma.reaction.count({where: {blogId, type: 'LIKE'}})
        const dislikes = await prisma.reaction.count({where: {blogId, type: 'DISLIKE'}})

        const existing = await prisma.reaction.findUnique({
            where: { userId_blogId: { userId, blogId } },
        })

        return c.json({
            likes: likes,
            dislikes: dislikes,
            userReaction: existing?.type || null
        })
    }catch(e){
        console.error(e)
        return c.json({
            msg: 'error occurred'
        })
    }
})

router.get("/blog/bulk", async (c) => {
  try {
    const prisma = new PrismaClient({
      datasourceUrl: c.env.DATABASE_URL,
    }).$extends(withAccelerate());

    const idsParam = c.req.query("ids") || "";
    const userId = c.get("userId");

    const blogIds = idsParam
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (blogIds.length === 0) {
      return c.json({ msg: "Invalid or missing blog IDs" }, 400);
    }

    const allReactions = await prisma.reaction.findMany({
      where: { blogId: { in: blogIds } },
      select: { blogId: true, type: true, userId: true },
    });

    const result = blogIds.map((id) => {
      const reactionsForBlog = allReactions.filter((r) => r.blogId === id);
      const likes = reactionsForBlog.filter((r) => r.type === "LIKE").length;
      const dislikes = reactionsForBlog.filter((r) => r.type === "DISLIKE").length;

      const userReactionObj = reactionsForBlog.find((r) => r.userId === userId);
      const userReaction = userReactionObj ? userReactionObj.type : null;

      return {
        blogId: id,
        likes,
        dislikes,
        userReaction, 
      };
    });

    return c.json({ reactions: result });
  } catch (e) {
    console.error("bulk reactions error:", e);
    return c.json({ msg: "Internal server error" }, 500);
  }
});



export default router