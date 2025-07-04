
/* IMPORT */

import {array, boolean, number, object, string} from 'skex';

/* MAIN */

const TabSchema = object ({
  active: boolean (),
  pinned: boolean (),
  selected: boolean (),
  groupId: number (),
  url: string ()
});

const TabsSchema = array ( TabSchema );

const TabGroupSchema = object ({
  id: number (),
  title: string (),
  color: string (),
  collapsed: boolean ()
});

const TabGroupsSchema = array ( TabGroupSchema );

const SessionSchema = object ({
  id: string (),
  name: string (),
  tabs: TabsSchema,
  tabGroups: TabGroupsSchema
});

const SessionsSchema = array ( SessionSchema );

/* EXPORT */

export {TabSchema, TabsSchema, SessionSchema, SessionsSchema};
