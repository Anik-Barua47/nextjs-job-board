import { auth } from "@/auth"

export const currentRole = async () => {
    const session = await auth();
    // console.log(session?.user?.role)

    return session?.user?.role;
}