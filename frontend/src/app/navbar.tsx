'use client'

const navigation = [
    { name: 'Visualize', href: '/visualize' }
]

function classNames(...classes: string[]){
    return classes.filter(Boolean).join(' ');
}

export default function Navbar() {
    return (
        <div className="">
        {navigation.map((item) => (
          <a
            key={item.name}
            href={item.href}
          >
            {item.name}
          </a>
        ))}
      </div>
    )
}