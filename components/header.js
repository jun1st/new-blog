import Link from "next/link";



export default function Header() {
    return (
        <header>
            <h1 style={{marginTop: 0}}>
                <Link href="/">fengd's personal zone</Link>
            </h1>
        </header>
    )
}