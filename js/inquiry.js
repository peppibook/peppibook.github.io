/* ══════════════════════════════════════
   문의 양식 → Supabase (public.inquiries)
   ══════════════════════════════════════ */

const form = document.getElementById('inquiry-form');
const statusEl = document.getElementById('inquiry-status');
const inquiryEnglish = document.documentElement.lang.startsWith('en');
const inquiryCopy = inquiryEnglish ? {
  short: 'Please enter at least 5 characters in your message.',
  sending: 'Sending…',
  success: 'Your inquiry has been received. I will reply using the contact details you provided.',
  failure: 'Your inquiry could not be sent. Please try again later or contact me by email.',
} : {
  short: '문의 내용을 5자 이상 적어 주세요.',
  sending: '보내는 중…',
  success: '문의가 접수되었습니다. 남겨 주신 연락처로 답장드리겠습니다.',
  failure: '전송에 실패했습니다. 잠시 후 다시 시도하시거나 이메일로 연락해 주세요.',
};

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
    setStatus(inquiryCopy.short, 'error');
    return;
  }

  const button = form.querySelector('button[type="submit"]');
  button.disabled = true;
  setStatus(inquiryCopy.sending, 'pending');

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
    setStatus(inquiryCopy.success, 'ok');
  } catch (err) {
    console.error('[inquiry]', err);
    setStatus(inquiryCopy.failure, 'error');
  } finally {
    button.disabled = false;
  }
});
