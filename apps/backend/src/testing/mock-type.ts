export type MockType<T> = {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  [P in keyof T]?: jest.Mock<{}>;
};
