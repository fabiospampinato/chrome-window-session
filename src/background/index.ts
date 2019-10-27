
/* IMPORT */

import '../../resources/icon/icon-16.png';
import '../../resources/icon/icon-32.png';
import '../../resources/icon/icon-48.png';
import '../../resources/icon/icon-64.png';
import '../../resources/icon/icon-128.png';
import '../../resources/icon/icon-256.png';

import Badge from './badge';
import Config from './config';
import State from './state';
import Tabs from './events/tabs';
import Window from './window';
import Windows from './events/windows';

/* BACKGROUND */

State.init ();
Badge.updateWindows ();
Tabs.listen ();
Windows.listen ();

/* EXPORT */

window['EXT'] = { Config, State, Window };
