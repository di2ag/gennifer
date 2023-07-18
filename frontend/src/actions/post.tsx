'use server'

import { StudyProps, StudyRequestProps } from "@/const"
import { authOptions } from "@/lib/auth"
import { getGenniferUrl } from "@/lib/utils"
import { getServerSession } from "next-auth"
import { revalidate } from "./revalidate"

export async function postStudy(data: StudyRequestProps) {
    const user = await getServerSession(authOptions)
    const response = await fetch(getGenniferUrl() + 'studies/', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + user?.user.access_token,
        },
        body: JSON.stringify(data),
    })
    const postData = await response.json()
    return postData
}

export async function PerformDelete(entityId: string | number, url: string, revalidateTag: string) {
    const user = await getServerSession(authOptions)
    await fetch(url + entityId, {
        headers: {
            "Authorization": "Bearer " + user?.user.access_token,
        },
        method: "DELETE",
      });
    
      await revalidate(revalidateTag);
    }