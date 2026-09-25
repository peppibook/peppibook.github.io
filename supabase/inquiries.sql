-- 혼잡스 사이트 문의 양식 테이블
-- Supabase 대시보드 → SQL Editor 에 붙여넣고 Run 하세요. (한 번만)

create table if not exists public.inquiries (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  name        text not null check (char_length(name) between 1 and 50),
  contact     text not null check (char_length(contact) between 3 and 100),
  category    text not null check (category in ('강의', '가이드', '사역', '기타')),
  message     text not null check (char_length(message) between 5 and 2000)
);

-- 행 수준 보안: 방문자(anon)는 새 문의를 '쓰기'만 가능, 읽기·수정·삭제 불가
alter table public.inquiries enable row level security;

revoke all on public.inquiries from anon, authenticated;
grant insert (name, contact, category, message) on public.inquiries to anon;

drop policy if exists "anyone can submit inquiry" on public.inquiries;
create policy "anyone can submit inquiry"
  on public.inquiries
  for insert
  to anon
  with check (true);

-- 문의 확인: 대시보드 → Table Editor → inquiries
