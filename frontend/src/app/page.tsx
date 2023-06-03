import Navbar from "./navbar"
import { AlgorithmTable, Algorithm } from "./table"



export default async function Home() {
  
  const data: Algorithm[] = await fetch('http://localhost/gennifer/api/algorithms')
  .then((resp) => resp.json())


  return (
    <main className="min-h-screen">
      <Navbar />
      <h2>Available Algorithms</h2>
      <AlgorithmTable algos={data} />
    </main>
  )
}
