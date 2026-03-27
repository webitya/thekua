import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { cookies } from "next/headers";

export async function isAdmin(req) {
    // 1. Check NextAuth session
    const session = await getServerSession(authOptions);
    if (session?.user?.role === 'admin') {
        return true;
    }

    // 2. Check custom admin token
    const cookieStore = await cookies();
    const adminToken = cookieStore.get('admin_token');

    if (adminToken && adminToken.value === 'authenticated') {
        return true;
    }

    return false;
}
