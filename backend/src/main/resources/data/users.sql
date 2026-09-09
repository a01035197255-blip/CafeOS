INSERT INTO users (
    user_id,
    email,
    password,
    name,
    phone,
    birth_date,
    gender,
    role,
    provider,
    enabled,
    created_at,
    updated_at
) VALUES
      (
          1,
          'a01035197255@gmail.com',
          'dlwlsh@0035',
          '이지노',
          '010-1111-1111',
          '1996-06-01',
          'MALE',
          'OWNER',
          NULL,
          true,
          '2026-01-01 00:00:00',
          '2026-01-01 00:00:00'
      ),
      (
          2,
          '01034887255@naver.com',
          'dlwlsh@0035',
          '심은진',
          '010-2222-2222',
          '1995-01-01',
          'FEMALE',
          'MANAGER',
          NULL,
          true,
          '2026-01-01 00:00:00',
          '2026-01-01 00:00:00'
      ),
      (
          3,
          'wlsh95@naver.com',
          'dlwlsh@0035',
          '홍현준',
          '010-3333-3333',
          '1995-01-01',
          'MALE',
          'STAFF',
          NULL,
          true,
          '2026-01-01 00:00:00',
          '2026-01-01 00:00:00'
      );

SELECT setval('users_user_id_seq', 3, true);