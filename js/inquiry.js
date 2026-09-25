/* ══════════════════════════════════════
   문의 양식 → Supabase (public.inquiries)
   ══════════════════════════════════════ */

const form = document.getElementById('inquiry-form');
const statusEl = document.getElementById('inquiry-status');

const setStatus = (msg, type) => {
  statusEl.textContent = msg;
  statusEl.dataset.type = type;
};

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  // 스팸 봇 차단용 숨김 칸 — 사람은 비워 둡니다
  if (data.website) return;

  const payload = {
    name: data.name.trim(),
    contact: data.contact.trim(),
    category: data.category,
    message: data.message.trim(),
  };

  if (payload.message.length < 5) {
    setStatus('문의 내용을 5자 이상 적어 주세요.', 'error');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus('보내는 중…', 'pending');

  try {
    const res = await fetch(`${window.SUPABASE_URL}/rest/v1/inquiries`, {
      method: 'POST',
      headers: {
        apikey: window.SUPABASE_PUBLISHABLE_KEY,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${await res.text()}`);
    form.reset();
    setStatus('문의가 접수되었습니다. 남겨 주신 연락처로 답장드리겠습니다.', 'ok');
  } catch (err) {
    console.error('[inquiry]', err);
    setStatus('전송에 실패했습니다. 잠시 후 다시 시도하시거나 이메일로 연락해 주세요.', 'error');
  } finally {
    button.disabled = false;
  }
});
