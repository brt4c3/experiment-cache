export async function loadMessages() {
  try {
    const res = await fetch('/messages.tsv');
    const text = await res.text();
    return text.trim().split('\n').map(line => line.split('\t')[0]);
  } catch (err) {
    console.error('Failed to load messages.tsv:', err);
    return ['(ﾟ∀ﾟ)', '草', 'ｷﾀ━！'];
  }
}
