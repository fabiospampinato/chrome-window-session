
/* MAIN */

type Props = {
  active: $<Session | SessionTemporary | undefined>,
  sessions: $<(Session | SessionTemporary)[]>,
};

/* EXPORT */

export type {Props};
