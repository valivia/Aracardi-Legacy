export type HasAtLeast<T, K extends keyof T> = Partial<T> & Pick<T, K>;
