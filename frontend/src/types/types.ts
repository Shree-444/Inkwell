export type blog = {
  authorId: number,
  content: string,
  created_at: string,
  id: number,
  title: string,
  author: {
    name: string,
    bio: string,
    city: string,
    created_at: string
  },
  likes?: number,
  dislikes?: number,
  userReaction?: "LIKE" | "DISLIKE" | null
}

export type userType = {
    name: string,
    email: string,
    password: string,
    bio: string,
    city: string,
    created_at: string,
    id?: string | number
}