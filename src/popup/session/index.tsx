
/* IMPORT */

import './styles.css';
import {$, $$, Ternary, useEffect, useResolved} from 'voby';
import zeptoid from 'zeptoid';
import Button from '../button';
import {CopyIcon, DeleteIcon, DeleteForeverIcon, RenameIcon, SaveIcon, UndoIcon} from '../icons';
import RPC from '../rpc';
import {isSessionTemporary} from '../utils';
import type {Props, EditingProps, ViewingProps} from './types';

/* MAIN */

const Session = ( { active, selected, session }: Props ): JSX.Element => {

  //TODO: Reaplace these with a single "writable memo", once Voby supports it built-in
  const editingImplicitly = () => isSessionTemporary ( $$(session) );
  const editingExplicitly = $(false);
  const editing = () => editingImplicitly () || editingExplicitly ();

  const onCopy = (): void => {
    const urls = $$(session).tabs.map ( tab => tab.url ).join ( '\n' );
    navigator.clipboard.writeText ( urls );
  };

  const onDelete = (): void => {
    useResolved ( session, session => {
      if ( session.id ) {
        RPC.deleteSession ( session.id );
      }
    });
  };

  const onEdit = (): void => {
    editingExplicitly ( true );
  };

  const onOpen = (): void => {
    useResolved ( session, session => {
      if ( session.id ) {
        RPC.openSession ( session.id );
      }
    });
  };

  const onSave = ( name: string ): void => {
    editingExplicitly ( false );
    useResolved ( [active, session], ( active, session ) => {
      if ( session.name === name ) { // Nothing changed
        return;
      } else if ( session.id ) { // Rename
        RPC.renameSession ( session.id, name );
      } else { // Insert
        const id = zeptoid ();
        const tabs = session.tabs;
        const windowId = $$(active)?.windowId;
        RPC.insertSession ({ id, name, tabs, windowId });
      }
    });
  };

  const onUnedit = (): void => {
    editingExplicitly ( false );
  };

  return (
    <Ternary when={editing}>
      <Session.Editing selected={selected} session={session} onCancel={onUnedit} onSave={onSave} />
      <Session.Viewing selected={selected} session={session} onCopy={onCopy} onDelete={onDelete} onOpen={onOpen} onRename={onEdit} />
    </Ternary>
  );

};

/* UTILITIES */

Session.Editing = ( { selected, session, onCancel, onSave }: EditingProps ): JSX.Element => {

  const input = $<HTMLInputElement>();
  const name = () => $$(session).name ?? '';

  const onKeyDown = ( event: KeyboardEvent ): void => {
    if ( event.keyCode === 27 ) { // Escape
      const isTemporary = isSessionTemporary ( $$(session) );
      if ( !isTemporary ) { // They are permanently editable
        event.preventDefault ();
        onCancel ();
      }
    }
  };

  const onUpdate = (): void => {
    const value = $$(input)?.value.trim ();
    if ( !value ) return;
    onSave ( value );
  };

  const onSubmit = ( event: SubmitEvent ): void => {
    event.preventDefault ();
    onUpdate ();
  };

  useEffect ( () => {
    const target = input ();
    if ( !target ) return;
    target.focus ();
    target.addEventListener ( 'keydown', onKeyDown );
    return () => {
      target.removeEventListener ( 'keydown', onKeyDown );
    };
  });

  return (
    <div class={{ session: true, editing: true, selected }}>
      <form onSubmit={onSubmit}>
        <input ref={input} type="text" placeholder="Session name..." value={name} />
      </form>
      <Button title="Save" onClick={onUpdate}>
        <SaveIcon />
      </Button>
    </div>
  );

};

Session.Viewing = ( { selected, session, onCopy, onDelete, onOpen, onRename }: ViewingProps ): JSX.Element => {

  const deleting = $(false);
  const name = () => $$(session).name ?? '';
  const tabsNr = () => $$(session).tabs.length;

  const onDeleting = (): void => {
    deleting ( true );
  };

  const onUndeleting = (): void => {
    deleting ( false );
  };

  return (
    <div class={{ session: true, deleting, selected }}>
      <div class="session-name" onClick={onOpen}>
        {name}
        <div class="session-count">
          {tabsNr}
        </div>
      </div>
      <Ternary when={deleting}>
        <>
          <Button title="Undo" onClick={onUndeleting}>
            <UndoIcon />
          </Button>
          <Button title="Confirm deletion" onClick={onDelete}>
            <DeleteForeverIcon />
          </Button>
        </>
        <>
          <Button title="Copy URLs" onClick={onCopy}>
            <CopyIcon />
          </Button>
          <Button title="Rename" onClick={onRename}>
            <RenameIcon />
          </Button>
          <Button title="Delete" onClick={onDeleting}>
            <DeleteIcon />
          </Button>
        </>
      </Ternary>
    </div>
  );

};

/* EXPORT */

export default Session;
