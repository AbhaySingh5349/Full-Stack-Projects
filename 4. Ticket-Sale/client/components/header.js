import Link from 'next/link';

export const Header = ({ user }) => {
  const links = [
    !user && { label: 'Register', href: '/auth/register' },
    !user && { label: 'Log In', href: '/auth/login' },
    user && { label: 'Log Out', href: '/auth/logout' },
  ]
    .filter((linkConfig) => linkConfig)
    .map(({ label, href }) => {
      return (
        <li key={href} className="nav-item">
          <Link href={href}>{label}</Link>
        </li>
      );
    });

  return (
    <nav className="nav navbar navbar-light bg-light">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand">
          GitTix
        </Link>

        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center">{links}</ul>
        </div>
      </div>
    </nav>
  );
};

// export default CustomHeader;
