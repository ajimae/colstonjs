import type { Middleware, Context } from "./types.d";

export default async function compose(context: Context, middlewares: Array<Middleware>) {
  let prevIndex: number = -1;

  async function runner(index: number): Promise<void> {
    if (index === prevIndex) {
      throw new Error('next() called multiple times')
    }

    prevIndex = index;
    const middleware = middlewares[index];

    if (middleware) {
      await middleware(context, () => {
        return runner(index + 1);
      });
    }
  }

  await runner(0)
}
