import Link from 'next/link';

const Navbar = () => {
  return (
    <nav>
      <ul className='nav'>
        <li className='first'>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="https://running.fengqijun.xyz">Running</Link>
        </li>
        <li>
          <Link href="/about">About</Link>
        </li>
        {/* Add more menu items as needed */}
      </ul>
    </nav>
  );
};

export default Navbar;     