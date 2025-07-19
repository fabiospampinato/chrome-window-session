
/* IMPORT */

import './styles.css';
import {$$, useMemo} from 'voby';
import {useState, useWindowId} from '../hooks';
import Sessions from '../sessions';
import {isSessionSaved, isSessionTemporary} from '../utils';

/* MAIN */

const App = (): JSX.Element => {

  const state = useState ();
  const windowId = useWindowId ();

  const sessionsTemporary = useMemo ( () => {
    const {session} = $$(state);
    if ( !session ) return [];
    if ( !isSessionTemporary ( session ) ) return [];
    if ( session.windowId !== $$(windowId) ) return [];
    return [session];
  });

  const sessionsSaved = useMemo ( () => {
    const {sessions} = $$(state);
    return sessions.filter ( isSessionSaved ).sort ( ( a, b ) => a.name.localeCompare ( b.name ) );
  });

  const sessions = useMemo ( () => {
    return [
      ...$$(sessionsTemporary),
      ...$$(sessionsSaved)
    ];
  });

  const active = useMemo ( () => {
    const saved = sessionsSaved ().find ( session => session.windowId === $$(windowId) );
    const temporary = sessionsTemporary ().find ( session => session.windowId === $$(windowId) );
    return saved || temporary
  });

  return <Sessions active={active} sessions={sessions} />;

};

/* EXPORT */

export default App;
