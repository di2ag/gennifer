"use client"

import { revalidate } from "@/actions/revalidate";
import Button from "@/components/ui/Button"
import { getGenniferUrl } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FC, useState } from 'react';

interface RunStudyButtonProps {
  studyId: number;
}

const RunStudyButton: FC<RunStudyButtonProps> = ({ studyId }) => {
const [isLoading, setIsLoading] = useState<boolean>(false);
const { data: session, status, update } = useSession();
const { push } = useRouter()

const handleRunStudy = () => {
    setIsLoading(true);
    update();
    const response = fetch(getGenniferUrl() + 'run/', {
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session?.user.access_token,
        },
        body: JSON.stringify({
            "study_id": studyId,
        }),
        method: "POST",
    }).then((resp) => resp.json());
    revalidate('studies');
    setIsLoading(false);
    push('/dashboard')
}
  return (
    <Button
        isLoading={isLoading}
        variant="outline"
        size="sm"
        onClick={handleRunStudy}
        >
        Run Study
    </Button>
  )
}

export default RunStudyButton;