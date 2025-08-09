async function loadFlashcards() {
  const status = document.getElementById('status');
  const list = document.getElementById('cards');
  try {
    const res = await fetch('/api/de/flashcards');
    if (!res.ok) throw new Error('Erro ao carregar');
    const data = await res.json();
    status.textContent = '';
    data.forEach(card => {
      const li = document.createElement('li');
      li.textContent = `${card.term} - ${card.translation}`;
      list.appendChild(li);
    });
  } catch (err) {
    status.textContent = 'Erro: ' + err.message;
  }
}
loadFlashcards();
