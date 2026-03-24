import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { convertServerPatchToFullTree } from "next/dist/client/components/segment-cache/navigation";

export async function GET() {
    const user = await getAuthUser();

    if (!user) {
        return NextResponse.json({
            error: "Unauthorized"
        }, {
            status: 401
        })
    }
    return NextResponse.json({ user })
}