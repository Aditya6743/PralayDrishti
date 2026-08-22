async function test() {
  const res = await fetch('http://localhost:3000/api/demo/start', { method: 'POST' });
  const text = await res.text();
  console.log(res.status, text.substring(0, 100));
}
test();
