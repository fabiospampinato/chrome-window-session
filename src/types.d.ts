
/* HELPERS */

type $<T> = (() => T) | T;

type Callback = () => void;

/* MAIN */

type Tab = {
  active: boolean,
  pinned: boolean,
  selected: boolean,
  url: string
};

type Session = {
  id: string,
  name: string,
  tabs: Tab[],
  windowId?: number
};

type SessionTemporary = {
  id?: undefined,
  name?: undefined,
  tabs: Tab[],
  windowId: number
};

type State = {
  // All known sessions
  sessions: (Session | SessionTemporary)[],
  // The current session
  session: Session | SessionTemporary | undefined
};
