
/* HELPERS */

type $<T> = (() => T) | T;

type Callback = () => void;

/* MAIN */

type Tab = {
  active: boolean,
  pinned: boolean,
  selected: boolean,
  groupId: number,
  url: string
};

type TabGroup = {
  id: number,
  title: string,
  color: string,
  collapsed: boolean
};

type TabGroupColor = (
  'blue' |
  'cyan' |
  'green' |
  'grey' |
  'orange' |
  'pink' |
  'purple' |
  'red' |
  'yellow'
);

type Session = {
  id: string,
  name: string,
  tabs: Tab[],
  tabGroups: TabGroup[],
  windowId?: number
};

type SessionTemporary = {
  id?: undefined,
  name?: undefined,
  tabs: Tab[],
  tabGroups: TabGroup[],
  windowId: number
};

type State = {
  // All known sessions
  sessions: (Session | SessionTemporary)[],
  // The current session
  session: Session | SessionTemporary | undefined
};
