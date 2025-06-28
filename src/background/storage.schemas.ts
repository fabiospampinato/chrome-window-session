
/* IMPORT */

import {array, boolean, object, string} from 'skex';

/* MAIN */

const TabSchema = object ({
  active: boolean (),
  pinned: boolean (),
  selected: boolean (),
  url: string ()
});

const TabsSchema = array ( TabSchema );

const SessionSchema = object ({
  id: string (),
  name: string (),
  tabs: TabsSchema
});

const SessionsSchema = array ( SessionSchema );

/* EXPORT */

export {TabSchema, TabsSchema, SessionSchema, SessionsSchema};
