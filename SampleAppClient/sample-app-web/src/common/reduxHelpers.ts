import { History } from "history";
import { CallEffectFn } from "redux-saga/effects";

// https://medium.com/@martin_hotell/improved-redux-type-safety-with-typescript-2-8-2c11a8062575

export type AnyFunction = (...args: any[]) => any;
export interface IStringMap<T> {
  [key: string]: T;
}
export type Action<T extends string = string, P = void> = P extends void
  ? Readonly<{ type: T }>
  : Readonly<{ type: T; payload: P }>;

export type ActionsUnion<A extends IStringMap<AnyFunction>> = ReturnType<
  A[keyof A]
>;

// conditional type for filtering actions in epics/effects
export type ActionsOfType<
  ActionUnion,
  ActionType extends string
> = ActionUnion extends Action<ActionType> ? ActionUnion : never;

export function createAction<T extends string>(type: T): Action<T>;
export function createAction<T extends string, P>(
  type: T,
  payload: P
): Action<T, P>;
export function createAction<T extends string, P>(type: T, payload?: P) {
  const action = payload === undefined ? { type } : { type, payload };
  return action;
}

export type HistoryPushFunctionForStringPath = (
  path: string,
  state?: any
) => void;

export function getCallableHistoryPush(
  history: History
): CallEffectFn<HistoryPushFunctionForStringPath> {
  return { context: history, fn: history.push };
}
