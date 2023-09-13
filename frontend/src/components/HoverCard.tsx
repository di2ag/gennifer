"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"

import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    } from "@/components/ui/sheet"

import Button from "@/components/ui/Button";
import { AnyMxRecord } from "dns";
import Paragraph from "./ui/Paragraph";
import LargeHeading from "./ui/LargeHeading";

interface GeneHoverCardProps {
    name: string;
    curie: string;
    chp_preffered_curie: string;
}

interface EdgeHoverCardProps {
    weight: string;
    algorithm: string;
    dataset: string;
    annotations: any;
}

export function GeneHoverCard({ name, curie, chp_preffered_curie }: GeneHoverCardProps) {
  return (
  <Card className="w-[350px] bg-slate-100">
  <CardHeader>
    <CardTitle>{name}</CardTitle>
    <CardDescription>
        {curie}
        {chp_preffered_curie}
    </CardDescription>
  </CardHeader>
  </Card>
  )
}

export function EdgeHoverCard({ weight, algorithm, dataset, annotations }: EdgeHoverCardProps) {
    return (
    <Card className="w-[350px] bg-slate-100">
    <CardHeader>
      <CardTitle>{weight}</CardTitle>
      <CardDescription>
        Edge information.
      </CardDescription>
    </CardHeader>
    <CardContent>
        <Paragraph size="sm"><strong>Algorithm:</strong> {algorithm}</Paragraph>
        <Paragraph size="sm"><strong>Dataset:</strong> {dataset}</Paragraph>
        <Paragraph size="sm"><strong>Evidence Count:</strong> {annotations.translator.length}</Paragraph>
    </CardContent>
    <CardFooter>
        <Sheet>
        <SheetTrigger asChild>
            <Button 
            variant={"ghost"}>
                View Evidence
            </Button>
        </SheetTrigger>
        <SheetContent position="right" size="content" >
            <div>
                <SheetHeader>
                <SheetTitle>Translator Evidence</SheetTitle>
                <SheetDescription>
                    Annotated evidence for this edge.
                </SheetDescription>
                </SheetHeader>
                    <div className="flex flex-col text-justify py-4">
                        { annotations.translator.length === 0 &&
                            <Paragraph size="sm">No evidence found.</Paragraph>
                        }
                        <ul>
                        { annotations.translator.map((annotation: any ) => (
                            <li>
                                <h2 className="font-extrabold">{annotation.formatted_relation}</h2>
                                <div className="flex flex-col text-justify py-1">
                                <ul>
                                {
                                annotation.results.map((result:any) => (
                                    <li>
                                    <Paragraph size="sm"><span className="italic">Resourse:</span> {result.resource_id}</Paragraph>
                                    <Paragraph size="sm"><span className="italic">Primary Source:</span> {result.primary_source}</Paragraph>
                                    </li>
                                ))}
                                </ul>
                                </div>
                            </li>
                         ))}
                        </ul>
                    </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button
                            variant="outline"
                            size="sm"
                            type="submit"
                            >
                            Close
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </div>
        </SheetContent>
        </Sheet>
    </CardFooter>
    </Card>
    )
  }
