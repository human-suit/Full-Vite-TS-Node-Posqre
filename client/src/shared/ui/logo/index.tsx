import style from './index.module.scss';
import { LogoIcon } from '../../assets';
import { Link, useLocation } from 'react-router-dom';

export default function Logo() {
  const location = useLocation();

  return (
    <Link to={`/vacancies/?${location.search}`} className={style.logo}>
      <img src={LogoIcon} alt="HeadHunter Icon" />
      <p>.FrontEnd</p>
    </Link>
  );
}
