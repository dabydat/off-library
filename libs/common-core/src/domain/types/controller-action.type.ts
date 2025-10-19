export type ControllerAction<T = unknown> = {
    ROUTE: string;
    MESSAGE_PATTERN: T;
};
