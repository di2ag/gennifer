


const page = async () => {
    const data = await fetch('http://localhost:3000/products')
    .then((resp) => resp.json())

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>{JSON.stringify(data)}</div>
        </main>
    )
    
}

export default page