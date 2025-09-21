import { hc } from "hono/client";
import { AppType } from "../../backend/src";

// honoクライアントの作成
export const client = hc<AppType>('http://localhost:8787');