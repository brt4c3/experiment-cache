
<!DOCTYPE html>
<html>
<head>
  <title>Trigger Cache</title>
  <script>
    async function runSequence() {
      const res = await fetch("/cache/run-sequence");
      const txt = await res.text();
      alert(txt);
    }
  </script>
</head>
<body>
  <h1>Trigger Cache Sequence</h1>
  <button onclick="runSequence()">Run</button>
</body>
</html>
