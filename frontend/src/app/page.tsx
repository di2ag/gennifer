
import Paragraph from "@/ui/Paragraph";
//import { AlgorithmTable, Algorithm } from "./table"
import LargeHeading from '@/ui/LargeHeading';



export default async function Home() {
  
  const data: Algorithm[] = await fetch('http://localhost/gennifer/api/algorithms')
  .then((resp) => resp.json())

  return (
    <div className='relative h-screen flex items-center justify-center overflow-x-hidden'>
      <div className='container pt-32 max-w-7xl w-full mx-auto h-full'>
        <div className='h-full gap-6 flex flex-col justify-start lg:justify-center items-center lg:items-start'>
          <LargeHeading size='lg' className="three-d text-black dark:text-off-white">
            GenNIFER <br /> Powered by Translator.
          </LargeHeading>
          <Paragraph className='max-w-xl lg:text-left'>
            Gene Regulatory Inference at your fingertips.
          </Paragraph>
        </div>
      </div>
    </div>
    )

  // return (
  //     <main className="min-h-screen">
  //       <Navbar />
  //       <h2>Available Algorithms</h2>
  //       <AlgorithmTable algos={data} />
  //     </main>
  // )
}