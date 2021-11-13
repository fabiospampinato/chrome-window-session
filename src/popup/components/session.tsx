
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

  copy () {

    this.Window.copy ( this.props.name );

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

    const copyBtn = (
      <div className="button" title="Copy URLs" onClick={this.copy.bind ( this )}>
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="24" height="24" viewBox="0 0 24 24">
          <path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M13.94,14.81L11.73,17C11.08,17.67 10.22,18 9.36,18C8.5,18 7.64,17.67 7,17C5.67,15.71 5.67,13.58 7,12.26L8.35,10.9L8.34,11.5C8.33,12 8.41,12.5 8.57,12.94L8.62,13.09L8.22,13.5C7.91,13.8 7.74,14.21 7.74,14.64C7.74,15.07 7.91,15.47 8.22,15.78C8.83,16.4 9.89,16.4 10.5,15.78L12.7,13.59C13,13.28 13.18,12.87 13.18,12.44C13.18,12 13,11.61 12.7,11.3C12.53,11.14 12.44,10.92 12.44,10.68C12.44,10.45 12.53,10.23 12.7,10.06C13.03,9.73 13.61,9.74 13.94,10.06C14.57,10.7 14.92,11.54 14.92,12.44C14.92,13.34 14.57,14.18 13.94,14.81M17,11.74L15.66,13.1V12.5C15.67,12 15.59,11.5 15.43,11.06L15.38,10.92L15.78,10.5C16.09,10.2 16.26,9.79 16.26,9.36C16.26,8.93 16.09,8.53 15.78,8.22C15.17,7.6 14.1,7.61 13.5,8.22L11.3,10.42C11,10.72 10.82,11.13 10.82,11.56C10.82,12 11,12.39 11.3,12.7C11.47,12.86 11.56,13.08 11.56,13.32C11.56,13.56 11.47,13.78 11.3,13.94C11.13,14.11 10.91,14.19 10.68,14.19C10.46,14.19 10.23,14.11 10.06,13.94C8.75,12.63 8.75,10.5 10.06,9.19L12.27,7C13.58,5.67 15.71,5.68 17,7C17.65,7.62 18,8.46 18,9.36C18,10.26 17.65,11.1 17,11.74Z" />
        </svg>
      </div>
    );

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
          {!deleting && copyBtn}
          {!deleting && renameBtn}
          {!deleting && deleteBtn}
        </div>
      );

    }

  }

}

/* EXPORT */

export default Session;
