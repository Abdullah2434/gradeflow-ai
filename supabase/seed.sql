-- GradeFlow AI — full demo seed
-- Demo login: teacher@test.com / password123

create extension if not exists pgcrypto with schema extensions;

-- Auth user
insert into auth.users (
  instance_id, id, aud, role, email, encrypted_password, email_confirmed_at,
  created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
  is_super_admin, confirmation_token, recovery_token, email_change_token_new,
  email_change, email_change_token_current, phone_change, phone_change_token,
  reauthentication_token
) values (
  '00000000-0000-0000-0000-000000000000',
  '11111111-1111-1111-1111-111111111111',
  'authenticated', 'authenticated', 'teacher@test.com',
  extensions.crypt('password123', extensions.gen_salt('bf')),
  now(), now(), now(),
  '{"provider":"email","providers":["email"]}',
  '{"full_name":"Demo Teacher"}', false,
  '', '', '', '', '', '', '', ''
) on conflict (id) do update set
  email = excluded.email,
  encrypted_password = excluded.encrypted_password,
  email_confirmed_at = excluded.email_confirmed_at,
  updated_at = now();

insert into auth.identities (
  id, user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at
) values (
  '11111111-1111-1111-1111-111111111111',
  '11111111-1111-1111-1111-111111111111',
  'teacher@test.com',
  jsonb_build_object('sub', '11111111-1111-1111-1111-111111111111', 'email', 'teacher@test.com'),
  'email', now(), now(), now()
) on conflict (id) do nothing;

-- Teacher + class + students
insert into public.teachers (id, auth_user_id, name, full_name, feedback_tone)
values ('22222222-2222-2222-2222-222222222222', '11111111-1111-1111-1111-111111111111', 'Demo Teacher', 'Demo Teacher', 'encouraging')
on conflict (id) do update set auth_user_id = excluded.auth_user_id;

insert into public.classes (id, teacher_id, name)
values ('00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222', 'Demo Class — Grade 10 History')
on conflict (id) do update set teacher_id = excluded.teacher_id, name = excluded.name;

insert into public.students (id, class_id, name, full_name, student_whatsapp_number, parent_whatsapp_number)
values
  ('00000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Alex Morgan', 'Alex Morgan', '15551876466', '15551876466'),
  ('00000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Jordan Lee', 'Jordan Lee', '15551876466', null)
on conflict (id) do update set name = excluded.name, full_name = excluded.full_name;

-- Assignments
insert into public.assignments (id, class_id, teacher_id, title, description, rubric_json, due_date)
values
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Essay 1: Industrial Revolution', 'Write a 500-word essay on how the Industrial Revolution changed urban life.',
   '[{"criterion":"Thesis clarity","max_points":10},{"criterion":"Historical evidence","max_points":15},{"criterion":"Writing quality","max_points":10}]'::jsonb,
   (current_date + interval '14 days')::date),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000001', '22222222-2222-2222-2222-222222222222',
   'Short Quiz: Fractions', 'Show your work for each problem.',
   '[{"criterion":"Correct answers","max_points":20},{"criterion":"Shown work","max_points":10}]'::jsonb,
   (current_date + interval '7 days')::date)
on conflict (id) do nothing;

-- Submissions (3 statuses for testing)
insert into public.submissions (id, assignment_id, student_id, file_url, file_type, extracted_text, status, submitted_at)
values
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000002', 'text://inline', 'text', 'The Industrial Revolution transformed cities...', 'pending_teacher_review', now() - interval '2 hours'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000003', 'text://inline', 'text', 'Industrial cities grew fast...', 'approved', now() - interval '1 day'),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000002', 'text://inline', 'text', '[illegible scan] 2/4 = 0.5', 'flagged_low_confidence', now() - interval '30 minutes')
on conflict (id) do nothing;

-- AI grades + one approved final grade + insights
insert into public.ai_grades (id, submission_id, criterion_scores, total_score, strengths, areas_to_improve, suggested_comment, confidence, model_version)
values
  ('ffffffff-ffff-ffff-ffff-ffffffffffff', 'cccccccc-cccc-cccc-cccc-cccccccccccc', '[{"criterion":"Thesis clarity","score":8,"max":10,"justification":"Clear thesis."}]'::jsonb, 27, 'Strong thesis.', 'Add examples.', 'Nice work, Alex.', 'high', 'claude-sonnet-4-6'),
  ('99999999-9999-9999-9999-999999999999', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '[{"criterion":"Thesis clarity","score":6,"max":10,"justification":"Implied."}]'::jsonb, 19, 'Basic understanding.', 'Add examples.', 'Jordan, add a thesis.', 'medium', 'claude-sonnet-4-6'),
  ('88888888-8888-8888-8888-888888888888', 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee', '[{"criterion":"Correct answers","score":5,"max":20,"justification":"Partial."}]'::jsonb, 7, 'Partial attempt.', 'Resubmit.', 'Please resubmit clearly.', 'low', 'claude-sonnet-4-6')
on conflict (id) do nothing;

insert into public.final_grades (id, submission_id, teacher_id, final_criterion_scores, final_total_score, final_feedback, edited_from_ai)
values ('77777777-7777-7777-7777-777777777777', 'dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', '[]'::jsonb, 19, 'Jordan, add a clear thesis.', false)
on conflict (submission_id) do nothing;

insert into public.class_insights (id, class_id, assignment_id, weak_criteria, common_errors)
values ('66666666-6666-6666-6666-666666666666', '00000000-0000-0000-0000-000000000001', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '[]'::jsonb, 'Students need more specific examples.')
on conflict (id) do nothing;
