import { Form, Link, NavLink } from '@remix-run/react';

import { twMerge } from 'tailwind-merge';

import { Button } from '~/components/ui/button';

type NavLinkItem = {
  name: string;
  href: string;
};

type NavLinkItems = NavLinkItem[];

const APP_NAME = 'ACME';

const DEFAULT_USER_LINKS_LIST: NavLinkItems = [
  {
    name: 'Notes',
    href: '/notes',
  },
];

const PUBLIC_LINKS_LIST: NavLinkItems = [
  {
    name: 'Sign In',
    href: '/sign-in',
  },
  {
    name: 'Sign Up',
    href: '/sign-up',
  },
];

export function Header({ username }: { username?: string }) {
  const baseStyle =
    'hover:text-foreground underline-offset-8 hover:underline hover:transition hover:duration-500 hover:ease-in-out focus:outline-none text-xl tracking-wider';

  const activeStyle = twMerge(baseStyle, 'text-active-foreground underline underline-offset-8');
  const inactiveStyle = twMerge(baseStyle, 'text-muted-foreground');

  return (
    <header className="container py-4">
      <nav className="flex flex-wrap items-center justify-between gap-4 sm:flex-nowrap md:gap-8">
        <Logo />
        <div className="flex items-center gap-2">
          {username ? (
            <div className="flex items-center gap-2">
              {DEFAULT_USER_LINKS_LIST.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) => {
                    return isActive ? activeStyle : inactiveStyle;
                  }}
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="flex items-center gap-2 rounded-md py-1">
                <span className="tracking-wide">{`${username}`}</span>
              </div>
              <Form action="/signout" method="post">
                <Button type="submit" variant="ghost">
                  <span>{`Sign Out`}</span>
                </Button>
              </Form>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {PUBLIC_LINKS_LIST.map(link => (
                <NavLink
                  key={link.href}
                  to={link.href}
                  className={({ isActive }) => {
                    return isActive ? activeStyle : inactiveStyle;
                  }}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}

function Logo() {
  return (
    <Link to="/" className="text-xl font-bold italic tracking-wider">
      {APP_NAME}
    </Link>
  );
}
