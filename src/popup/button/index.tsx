
/* IMPORT */

import './styles.css';
import type {Props} from './types';

/* MAIN */

const Button = ( { title, onClick, children }: Props ): JSX.Element => {

  return (
    <button title={title} onClick={onClick}>
      {children}
    </button>
  );

};

/* EXPORT */

export default Button;
