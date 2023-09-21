"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import Button from "@/components/ui/Button"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/toast"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"

import { getGenniferUrl } from "@/lib/utils"
import { useState } from "react"
import { useSession } from "next-auth/react"
import { revalidate } from "@/actions/revalidate"
import { DialogClose } from "@radix-ui/react-dialog"
import { useRouter } from 'next/navigation';
import { postStudy } from "@/actions/post"
import { AlgorithmProps, DatasetProps, StudyProps } from "@/const"
import { ScrollArea } from "@radix-ui/react-scroll-area"
import { truncateSync } from "fs"

interface TaskFormProps {
    studyId: number,
    algorithms: AlgorithmProps[],
    datasets: DatasetProps[],
}

export function TaskForm({ studyId, algorithms, datasets }: TaskFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const { data: session, status, update } = useSession();

  const AddTaskFormSchema = z.object({
    algorithm: z.string({required_error: "Please select an algorithm."}),
    dataset: z.string({required_error: "Please select a dataset."}),
  })

  const form = useForm<z.infer<typeof AddTaskFormSchema>>({
    resolver: zodResolver(AddTaskFormSchema),
    defaultValues: {
        algorithm: "",
        dataset: "",
    }
  })

  async function onSubmit(data: z.infer<typeof AddTaskFormSchema>) {
    setIsLoading(true);
    update();
    const responseAlgorithm = await fetch(getGenniferUrl() + 'algorithm_instances/', {
        headers: { 
            "Content-Type": "application/json",
            "Authorization": "Bearer " + session?.user.access_token,
        },
        body: JSON.stringify({
            algorithm: parseInt(data.algorithm),
        }),
        method: "POST",
    }).then((resp) => resp.json());
    // console.log(responseAlgorithm);
    //
    // Handling of hyperparameters CRUD goes here.
    //
    const response = await fetch(getGenniferUrl() + 'tasks/', {
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer " + session?.user.access_token,
        },
        body: JSON.stringify({
            algorithm_instance: responseAlgorithm.pk,
            dataset: data.dataset,
            study: studyId,
        }),
        method: "POST",
    }).then((resp) => resp.json());
    // console.log(response);
    revalidate('study'+ studyId);
    setIsLoading(false);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
    <DialogTrigger asChild>
        <Button isLoading={isLoading}
        variant="outline"
        size="sm"
        >
        Add Task
        </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
        <DialogTitle>Create Study</DialogTitle>
        </DialogHeader>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="algorithm"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Algorithm</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select an algorithm." />
                    </SelectTrigger>
                </FormControl>
                <SelectContent className="bg-white">
                        {algorithms.map(algorithm => (
                            <SelectItem key={'algorithm-'+ algorithm.pk} className="hover:bg-slate-100" value={algorithm.pk.toString()}>{algorithm.name}</SelectItem>
                        ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="dataset"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dataset</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder="Select a dataset." />
                    </SelectTrigger>
                </FormControl>
                <ScrollArea className="h-72">
                <div className="p-4">
                <SelectContent className="bg-white">
                        {datasets.map(dataset => (
                            <SelectItem key={'dataset-'+ dataset.pk} className="hover:bg-slate-100" value={dataset.zenodo_id}>{dataset.title + ': ' + dataset.zenodo_id}</SelectItem>
                        ))}
                </SelectContent>
                </div>
                </ScrollArea>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          {/* <DialogClose asChild> */}
            <Button type="submit">Submit</Button>
          {/* </DialogClose> */}
        </DialogFooter>
        </form>
    </Form>
    </DialogContent>
    </Dialog>
  )
}
