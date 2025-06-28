
/* IMPORT */

import './styles.css';
import {$$, For} from 'voby';
import Session from '../session';
import type {Props} from './types';

/* MAIN */

const Sessions = ( { active, sessions }: Props ): JSX.Element => {

  return (
    <div class="sessions">
      <For values={sessions}>
        {session => {
          const selected = () => $$(session).windowId === $$(active)?.windowId;
          return <Session active={active} selected={selected} session={session} />;
        }}
      </For>
    </div>
  );

};

/* EXPORT */

export default Sessions;
