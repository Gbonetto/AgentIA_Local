// src/api/api.js
export async function queryRAG(question, files = []) {
  try {
    const res = await fetch('/ask', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question, files }) });
    if (!res.ok) throw new Error(res.statusText);
    const { answer } = await res.json();
    return answer;
  } catch (e) {
    console.error(e);
    return '❌ Erreur de connexion au backend.';
  }
}