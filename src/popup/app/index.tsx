
/* IMPORT */

import './styles.css';
import {$$, useMemo, useResolved} from 'voby';
import {useState} from '../hooks';
import Sessions from '../sessions';
import {isSessionSaved, isSessionTemporary} from '../utils';

/* MAIN */

const App = (): JSX.Element => {

  const state = useState ();
  const active = () => $$(state).session;

  const sessions = useMemo ( () => {

    return useResolved ( state, ({ sessions, session }) => {

      const sessionsSaved = sessions.filter ( isSessionSaved ).sort ( ( a, b ) => a.name.localeCompare ( b.name ) );
      const sessionsTemporary = session && isSessionTemporary ( session ) ? [session] : [];

      return [...sessionsTemporary, ...sessionsSaved];

    });

  });

  return <Sessions active={active} sessions={sessions} />;

};

/* EXPORT */

export default App;
