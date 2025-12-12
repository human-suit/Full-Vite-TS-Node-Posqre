import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import style from './index.module.scss';

interface CustomLinkProps {
  to: string;
  children: React.ReactNode;
}

export default function CustomLink({ to, children }: CustomLinkProps) {
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: false });
  return (
    <Link className={match ? style.active : style.none} to={to}>
      {children}
    </Link>
  );
}
