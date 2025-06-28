
/* MAIN */

type Props = {
  active: $<Session | SessionTemporary | undefined>,
  selected: $<boolean>,
  session: $<Session | SessionTemporary>
};

type EditingProps = {
  selected: $<boolean>,
  session: $<Session | SessionTemporary>,
  onCancel: Callback,
  onSave: ( name: string ) => void
};

type ViewingProps = {
  selected: $<boolean>,
  session: $<Session | SessionTemporary>,
  onCopy: Callback,
  onDelete: Callback,
  onOpen: Callback,
  onRename: Callback
};

/* EXPORT */

export type {Props, EditingProps, ViewingProps};
