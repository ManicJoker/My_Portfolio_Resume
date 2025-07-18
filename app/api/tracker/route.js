const logStore = []

export async function POST(req) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    null;

  const userAgent = req.headers.get("user-agent") || null;
  const language = req.headers.get("accept-language") || null;

  const body = await req.json();
  const { event = "unknown", fingerprint, geo, component } = body || {};

  const logEntry = {
    timestamp: new Date().toISOString(),
    ip,
    event,
    userAgent,
    language,
    fingerprint,
    geo,
    component,
  };

  logStore.push(logEntry); // Use a real DB or store in prod

  return new Response(JSON.stringify({ message: "logged" }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function GET() {
  return new Response("Method not allowed", { status: 405 });
}

export function getLogs(){
    return logStore
}