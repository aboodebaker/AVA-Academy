import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

const serverSession = async () => {
    const prisma = new PrismaClient()
  const session = await getServerSession(authOptions);
  const user = session?.user
  const userId = user.id;

  const users = await prisma.user.findUnique({
    where: {
        id: userId
    }
  })
    return users
}

export default serverSession