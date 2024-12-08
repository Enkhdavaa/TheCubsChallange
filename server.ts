import { Application, createHttpError, HttpError, Status } from "@oak/oak";
import { router } from "./router.ts";

const app = new Application();

app.use(async (ctx, next) => {
  try {
    await next();
    if (ctx.response.status >= 400) {
      throw createHttpError(Status.NotFound);
    }
  } catch (e) {
    if (e instanceof HttpError) {
      ctx.response.status = e.status;
      ctx.response.headers.append("Content-Type", "text/html");
      ctx.response.body = `
        <!DOCTYPE html>
        <html>
          <body>
            <h1>${e.message}</h1>
          </body>
        </html>        
        `;
    }
  }
});

app.use(async (ctx, next) => {
  if (ctx.request.url.pathname.startsWith("/api")) {
    return next();
  }
  try {
    await ctx.send({
      root: import.meta.dirname + "/dist",
      index: "index.html",
    });
    return;
  } catch {
    return next();
  }
});

app.use(router.routes());
app.use(router.allowedMethods({ throw: true }));

app.listen({ port: 8080, hostname: "0.0.0.0" });
