
/* IMPORT */

import * as React from 'react';
import ContentSaveIcon from 'react-material-icon-svg/dist/ContentSaveIcon';
import DeleteIcon from 'react-material-icon-svg/dist/DeleteIcon';
import DeleteForeverIcon from 'react-material-icon-svg/dist/DeleteForeverIcon';
import RenameBoxIcon from 'react-material-icon-svg/dist/RenameBoxIcon';
import UndoIcon from 'react-material-icon-svg/dist/UndoIcon';

/* SESSION */

class Session extends React.Component<any, any> {

  input; Config; Window;

  /* CONSTRUCTOR */

  constructor ( props ) {

    super ( props );

    const {Config, Window} = ( chrome.extension.getBackgroundPage () as any ).EXT; //TSC
    this.Config = Config;
    this.Window = Window;

    this.state = {
      deleting: false,
      editing: false
    };

  }

  componentDidUpdate () {

    if ( this.state.editing && this.input ) {
      this.input.select ();
    }

  }

  /* API */

  cleanup () {

    if ( this.state.deleting ) {

      this.Window.delete ( this.props.name );

    }

  }

  open () {

    const {name, currentName} = this.props;

    if ( name === currentName ) return;

    this.Window.open ( name );

  }

  delete () {

    this.setState ({ deleting: true });

  }

  undo () {

    this.setState ({ deleting: false });

  }

  rename () {

    this.setState ({ editing: true });

  }

  save () {

    const newName = this.input.value;

    if ( newName ) {

      const {name, currentWindow} = this.props;

      if ( !name || name !== newName ) {

        if ( name ) {

          this.Window.rename ( name, newName );

        } else {

          this.Window.save ( currentWindow, newName );

        }

      }

    }

    this.setState ({ editing: false });

  }

  submit ( event ) {

    event.preventDefault ();

    this.save ();

  }

  render () {

    const {name, window, currentName} = this.props,
          {deleting, editing} = this.state,
          activeCss = name && name === currentName ? 'active' : '',
          deletingCss = deleting ? 'delete' : '';

    const saveBtn = (
      <div className="button" title="Save" onClick={this.save.bind ( this )}>
        <ContentSaveIcon />
      </div>
    );

    const undoBtn = (
      <div className="button" title="Undo" onClick={this.undo.bind ( this )}>
        <UndoIcon />
      </div>
    );

    const renameBtn = (
      <div className="button" title="Rename" onClick={this.rename.bind ( this )}>
        <RenameBoxIcon />
      </div>
    );

    const deleteBtn = (
      <div className="button" title="Delete" onClick={this.delete.bind ( this )}>
        <DeleteIcon />
      </div>
    );

    const cleanupBtn = (
      <div className="button" title="Confirm deletion" onClick={this.cleanup.bind ( this )}>
        <DeleteForeverIcon fill="red" />
      </div>
    );

    if ( !name || editing ) {

      return (
        <div className={`session ${activeCss} ${deletingCss}`}>
          <form onSubmit={this.submit.bind ( this )}>
            <input type="text" placeholder="Window name..." defaultValue={name || this.Config.window.name} ref={i => this.input = i} />
          </form>
          <div className="spacer"></div>
          {saveBtn}
        </div>
      );

    } else {

      return (
        <div className={`session ${activeCss} ${deletingCss}`}>
          <div className="name" onClick={this.open.bind ( this )}>{name} <span className="tabs-number">{window.tabs.length}</span></div>
          <div className="spacer"></div>
          {deleting && undoBtn}
          {deleting && cleanupBtn}
          {!deleting && renameBtn}
          {!deleting && deleteBtn}
        </div>
      );

    }

  }

}

/* EXPORT */

export default Session;
