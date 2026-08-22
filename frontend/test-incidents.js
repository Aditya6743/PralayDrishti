async function test() {
  const res = await fetch('http://localhost:3000/api/incidents', { method: 'GET' });
  const data = await res.json();
  console.log("Count:", data.length);
  if(data.length > 0) console.log("First:", data[0].title);
}
test();
