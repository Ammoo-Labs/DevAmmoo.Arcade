const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  console.error('\n❌ NEXT_PUBLIC_API_URL is not set — add it in Vercel → Settings → Environment Variables\n');
  process.exit(1);
}

console.log(`\n🔍 Checking backend connectivity: ${apiUrl}/health`);

try {
  const res = await fetch(`${apiUrl}/health`, {
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) {
    console.error(`\n❌ Backend health check failed — HTTP ${res.status} from ${apiUrl}/health\n`);
    process.exit(1);
  }

  const body = await res.json();
  console.log(`✅ Backend reachable — response: ${JSON.stringify(body)}\n`);
} catch (err) {
  console.error(`\n❌ Backend not reachable at ${apiUrl}/health`);
  console.error(`   Reason: ${err.message}`);
  console.error(`   Fix: confirm Render service is running and NEXT_PUBLIC_API_URL is correct\n`);
  process.exit(1);
}
