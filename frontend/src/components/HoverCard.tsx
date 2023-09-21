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

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
    } from "@/components/ui/accordion"

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
    } from "@/components/ui/table"

import { FilterTable } from '@/components/ui/FilterTable';
import { evidenceFilterColumns } from "@/app/explore/columns";

import Button from "@/components/ui/Button";
import Paragraph from "./ui/Paragraph";
import { AnnotationProps } from "@/const";
import React, { useEffect } from "react";
import AnimatedParagraph from "@/components/ui/AnimatedText"
import { fetchJustification } from "./OpenAIClient"
import { Skeleton } from "@mui/material"

interface GeneHoverCardProps {
    name: string;
    curie: string;
    chp_preffered_curie: string;
}

interface EdgeHoverCardProps {
    sourceName: string | null;
    targetName: string | null;
    directed: boolean;
    weight: string;
    algorithm: string;
    dataset: string;
    tr_annotations: AnnotationProps[];
}



export function GeneHoverCard({ name, curie, chp_preffered_curie }: GeneHoverCardProps) {
  return (
  <Card className="flex flex-col w-min-full bg-slate-100">
  <CardHeader>
    <CardTitle>{name}</CardTitle>
    <CardDescription>
    <div>
    <Table>
    <TableCaption>Gene Properties.</TableCaption>
    <TableHeader>
        <TableRow>
        <TableHead className="text-sm">Properties</TableHead>
        <TableHead className="text-right text-sm">Values</TableHead>
        </TableRow>
    </TableHeader>
    <TableBody>
        <TableRow>
        <TableCell className="font-medium text-sm">Curie</TableCell>
        <TableCell className="text-right text-sm">{curie}</TableCell>
        </TableRow>
        <TableRow>
        <TableCell className="font-medium text-sm">CHP Preferred Curie</TableCell>
        <TableCell className="text-right text-sm">{chp_preffered_curie}</TableCell>
        </TableRow>
    </TableBody>
    </Table>
    </div>
    </CardDescription>
  </CardHeader>
  </Card>
  )
}

function EdgeSheet({ sourceName, targetName, directed, weight, algorithm, dataset, tr_annotations }: EdgeHoverCardProps) {
    const [rowSelection, setRowSelection] = React.useState({})
    const [loadingOpenAI, setLoadingOpenAI] = React.useState<boolean>(false)
    const [justification, setJustification] = React.useState<String>('')

    const onViewEvidenceClick = async () => {
        setLoadingOpenAI(true)
        let systemContent = ''
        if (directed) {
            systemContent = "You are an expert bioinformatician. You will be provided with a source gene and a target gene, and your task is to briefly explain a possible genetic regulator relationship that the source gene may have on the target gene. If you do think there is a relationship, you should respond with: 'No relationship found.'"
        } else {
            systemContent = "You are an expert bioinformatician. You will be provided with a two gene names, and your task is to briefly explain a possible genetic regulatory relationship between these genes. If you do not think there is a relationship, you should respond with: 'No relationship found.'"
        }
        if (sourceName && targetName) {
            let userContent = `Source gene name: ${sourceName}\n Target gene name: ${targetName}.`
            let result = await fetchJustification(systemContent, userContent)
            setJustification(result)
        } else {
            setJustification('Justification unavailable due to missing gene names.')
        }
        setLoadingOpenAI(false)
    }

    return (
        <Sheet modal={true}>
        <SheetTrigger asChild>
            <Button className="w-full justify-center"
            variant={"ghost"}
            onClick={onViewEvidenceClick}>
                View Evidence
            </Button>
        </SheetTrigger>
        <SheetContent position="right" className="h-min-screen w-min-[50%] overflow-y-scroll">
            <SheetHeader>
                <SheetTitle>Discovered Evidence</SheetTitle>
                <SheetDescription>
                    Translator annotationed evidence and Large Language Model (LMM) justification for this edge.
                </SheetDescription>
            </SheetHeader>
            <div className="flex flex-col pt-4 text-center sm:text-left">
                <h3 className="font-semibold text-foreground">Justification</h3>
                <p className="text-xs text-muted-foreground">Powered by OpenAI GPT-3.5 turbo.</p>
                { loadingOpenAI ? 
                    <Skeleton className="h-4"/>
                    :
                    <AnimatedParagraph animated show size="sm" className="text-justify py-4">{justification}</AnimatedParagraph>
                }
            </div>
                <div className="flex flex-col pt-4 text-center sm:text-left">
                <h3 className="font-semibold text-foreground">Translator Evidence</h3>
                <p className="text-xs text-muted-foreground">Annotated evidence for this edge.</p>
            </div>
            <div className="flex flex-col text-justify py-4">
                { tr_annotations.length === 0 &&
                    <Paragraph size="sm">No evidence found.</Paragraph>
                }
                <Accordion type="single" collapsible className="w-full pb-4">
                { tr_annotations.map((a: AnnotationProps, i: number) => (
                    <AccordionItem value={`${a.name}-${i}`}>
                    <AccordionTrigger>{a.name}</AccordionTrigger>
                    <AccordionContent>
                    <div className="grid gap-4 py-4">
                        <FilterTable
                        columns={evidenceFilterColumns} 
                        data={a.evidence} 
                        searchPlaceholderText={'Search by Resource...'}
                        searchValue={'resource_id'}
                        rowSelection={rowSelection}
                        setRowSelection={setRowSelection}
                        pageCount={5}
                        />
                    </div>
                    </AccordionContent>
                    </AccordionItem>
                )
                )}
                </Accordion>
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
    )
}


export function EdgeHoverCard({ sourceName, targetName, directed, weight, algorithm, dataset, tr_annotations }: EdgeHoverCardProps) {
    
    return (
    <Card className="w-[350px] bg-slate-100">
    <CardContent>
        <div className="flex flex-col pt-4">
        <Table>
        <TableHeader>
            <TableRow>
            <TableHead>Properties</TableHead>
            <TableHead className="text-right">Values</TableHead>
            </TableRow>
        </TableHeader>
        <TableBody>
            <TableRow>
            <TableCell className="font-medium">Weight</TableCell>
            <TableCell className="text-right">{Math.round(parseFloat(weight) * 1000) / 1000}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">Algorithm</TableCell>
            <TableCell className="text-right">{algorithm}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">Dataset</TableCell>
            <TableCell className="text-right">{dataset}</TableCell>
            </TableRow>
            <TableRow>
            <TableCell className="font-medium">Evidence Count</TableCell>
            <TableCell className="text-right">{tr_annotations.length}</TableCell>
            </TableRow>
        </TableBody>
        </Table>
        </div>
    </CardContent>
    <CardFooter>
        <EdgeSheet
        sourceName={sourceName}
        targetName={targetName}
        directed={directed}
        weight={weight}
        algorithm={algorithm}
        dataset={dataset}
        tr_annotations={tr_annotations}
        />
    </CardFooter>
    </Card>
    )
  }
