function showSection(id) {
  document.querySelectorAll('section').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

async function loadInfo() {
  const container = document.getElementById('info-content');
  try {
    const res = await fetch('/api/de/info');
    if (!res.ok) throw new Error('Erro ao carregar');
    const data = await res.json();
    container.innerHTML = '';
    Object.entries(data).forEach(([key, value]) => {
      const p = document.createElement('p');
      p.textContent = `${key}: ${value}`;
      container.appendChild(p);
    });
  } catch (err) {
    container.textContent = 'Erro: ' + err.message;
  }
}

async function loadFlashcards() {
  const status = document.getElementById('flashcards-status');
  const list = document.getElementById('flashcards-list');
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

async function loadQuestions() {
  const status = document.getElementById('questions-status');
  const list = document.getElementById('questions-list');
  try {
    const res = await fetch('/api/de/questions');
    if (!res.ok) throw new Error('Erro ao carregar');
    const data = await res.json();
    status.textContent = '';
    data.forEach(q => {
      const li = document.createElement('li');
      li.textContent = q.question;
      const ul = document.createElement('ul');
      q.options.forEach(opt => {
        const optLi = document.createElement('li');
        optLi.textContent = opt;
        ul.appendChild(optLi);
      });
      li.appendChild(ul);
      list.appendChild(li);
    });
  } catch (err) {
    status.textContent = 'Erro: ' + err.message;
  }
}

async function sendAnamnesis() {
  const input = document.getElementById('anamnesis-input');
  const result = document.getElementById('anamnesis-result');
  try {
    const res = await fetch('/api/de/anamnesis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input.value })
    });
    if (!res.ok) throw new Error('Erro ao enviar');
    const data = await res.json();
    result.textContent = `${data.message}: ${data.receivedText}`;
  } catch (err) {
    result.textContent = 'Erro: ' + err.message;
  }
}

document.querySelectorAll('nav button').forEach(btn => {
  btn.addEventListener('click', () => showSection(btn.dataset.target));
});

document.getElementById('anamnesis-submit').addEventListener('click', sendAnamnesis);

loadInfo();
loadFlashcards();
loadQuestions();

