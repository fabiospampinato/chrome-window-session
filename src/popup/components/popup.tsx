
/* IMPORT */

import * as React from 'react';
import Session from './session';

/* POPUP */

class Popup extends React.Component<any, any> {

  State; Window; _refresh;

  constructor ( props ) {

    super ( props );

    const {State, Window} = ( chrome.extension.getBackgroundPage () as any ).EXT; //TSC
    this.State = State;
    this.Window = Window;

    this._refresh = this.refresh.bind ( this );

    this.state = {
      window: false,
      name: false,
      name2window: {}
    };

  }

  componentDidMount () {

    chrome.storage.onChanged.addListener ( this._refresh );

    this.refresh ();

  }

  componentWillUnmount () {

    chrome.storage.onChanged.removeListener ( this._refresh );

  }

  refresh () {

    chrome.windows.getCurrent ( { populate: true }, async window => {

      const name = await this.State.window2name ( window ),
            name2window = await this.State.name2window ();

      this.setState ({ window, name, name2window });

    });

  }

  render () {

    const {window, name, name2window} = this.state,
          names = this.State.namesSync ( name2window );

    return (
      <div id="popup">
        {!name && <Session currentWindow={window} />}
        {names.map ( n => <Session name={n} window={name2window[n]} currentName={name} currentWindow={window} key={n} /> )}
      </div>
    );

  }

}

/* EXPORT */

export default Popup;
