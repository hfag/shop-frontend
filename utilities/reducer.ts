/**
 * Wraps a function, useful for redux getters
 */
export const wrap = <T>(
  target: (object: { [key: string]: any }, ...args: Array<any>) => T,
  mapState: (state: {
    [key: string]: any;
  }) => { [key: string]: any } = ({}) => ({})
) => (state: {}, ...args: Array<any>) => target(mapState(state), ...args);
