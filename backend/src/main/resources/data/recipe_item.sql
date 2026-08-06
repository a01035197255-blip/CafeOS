INSERT INTO recipe_items
(recipe_id, ingredient_id, quantity)
VALUES

-- =========================
-- COFFEE
-- =========================

-- 1. 시그니처 아메리카노
(1,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(1,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250),
(1,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 2. 클래식 카페라떼
(2,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(2,(SELECT ingredient_id FROM ingredients WHERE name='우유'),200),
(2,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 3. 바닐라 크림 라떼
(3,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(3,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180),
(3,(SELECT ingredient_id FROM ingredients WHERE name='바닐라 시럽'),20),
(3,(SELECT ingredient_id FROM ingredients WHERE name='휘핑크림'),30),
(3,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 4. 카라멜 마끼아또
(4,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(4,(SELECT ingredient_id FROM ingredients WHERE name='우유'),200),
(4,(SELECT ingredient_id FROM ingredients WHERE name='카라멜 시럽'),20),
(4,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 5. 헤이즐넛 라떼
(5,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(5,(SELECT ingredient_id FROM ingredients WHERE name='우유'),200),
(5,(SELECT ingredient_id FROM ingredients WHERE name='헤이즐넛 시럽'),20),
(5,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 6. 카페모카
(6,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(6,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180),
(6,(SELECT ingredient_id FROM ingredients WHERE name='초콜릿 시럽'),25),
(6,(SELECT ingredient_id FROM ingredients WHERE name='휘핑크림'),20),
(6,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 7. 카푸치노
(7,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(7,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180),
(7,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 8. 콜드브루
(8,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),25),
(8,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250),
(8,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1),
(8,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180),

-- 9. 콜드브루 라떼
(9,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),25),
(9,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180),
(9,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1),
(9,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180),

-- 10. 아인슈페너
(10,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(10,(SELECT ingredient_id FROM ingredients WHERE name='정수'),180),
(10,(SELECT ingredient_id FROM ingredients WHERE name='생크림'),40),
(10,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1),
(10,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),150),

-- 11. 디카페인 아메리카노
(11,(SELECT ingredient_id FROM ingredients WHERE name='디카페인 원두'),18),
(11,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250),
(11,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 12. 디카페인 카페라떼
(12,(SELECT ingredient_id FROM ingredients WHERE name='디카페인 원두'),18),
(12,(SELECT ingredient_id FROM ingredients WHERE name='우유'),200),
(12,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 13. 블랙 크림 커피
(13,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(13,(SELECT ingredient_id FROM ingredients WHERE name='생크림'),30),
(13,(SELECT ingredient_id FROM ingredients WHERE name='정수'),200),
(13,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 14. 오트밀크 라떼
(14,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18),
(14,(SELECT ingredient_id FROM ingredients WHERE name='오트밀크'),200),
(14,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1),

-- 15. 헤이즐 콜드브루
(15,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),25),
(15,(SELECT ingredient_id FROM ingredients WHERE name='헤이즐넛 시럽'),20),
(15,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1),
(15,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180),

-- =========================
-- TEA
-- =========================

-- 16. 얼그레이 티
        ,(16,(SELECT ingredient_id FROM ingredients WHERE name='얼그레이 티백'),1)
        ,(16,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250)
        ,(16,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 17. 캐모마일 티
        ,(17,(SELECT ingredient_id FROM ingredients WHERE name='캐모마일 티백'),1)
        ,(17,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250)
        ,(17,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 18. 페퍼민트 티
        ,(18,(SELECT ingredient_id FROM ingredients WHERE name='페퍼민트 티백'),1)
        ,(18,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250)
        ,(18,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 19. 유자 허니티
        ,(19,(SELECT ingredient_id FROM ingredients WHERE name='유자청'),40)
        ,(19,(SELECT ingredient_id FROM ingredients WHERE name='꿀'),20)
        ,(19,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250)
        ,(19,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 20. 레몬 생강티
        ,(20,(SELECT ingredient_id FROM ingredients WHERE name='레몬청'),40)
        ,(20,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250)
        ,(20,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 21. 자몽 블랙티
        ,(21,(SELECT ingredient_id FROM ingredients WHERE name='홍차 티백'),1)
        ,(21,(SELECT ingredient_id FROM ingredients WHERE name='자몽청'),40)
        ,(21,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
        ,(21,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- 22. 애플 시나몬티
        ,(22,(SELECT ingredient_id FROM ingredients WHERE name='홍차 티백'),1)
        ,(22,(SELECT ingredient_id FROM ingredients WHERE name='시나몬 파우더'),3)
        ,(22,(SELECT ingredient_id FROM ingredients WHERE name='정수'),250)
        ,(22,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 23. 복숭아 아이스티
        ,(23,(SELECT ingredient_id FROM ingredients WHERE name='복숭아'),60)
        ,(23,(SELECT ingredient_id FROM ingredients WHERE name='홍차 티백'),1)
        ,(23,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
        ,(23,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- =========================
-- LATTE
-- =========================

-- 24. 제주 말차 라떼
        ,(24,(SELECT ingredient_id FROM ingredients WHERE name='말차 파우더'),20)
        ,(24,(SELECT ingredient_id FROM ingredients WHERE name='우유'),220)
        ,(24,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 25. 딸기 라떼
        ,(25,(SELECT ingredient_id FROM ingredients WHERE name='딸기'),80)
        ,(25,(SELECT ingredient_id FROM ingredients WHERE name='우유'),220)
        ,(25,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 26. 초콜릿 라떼
        ,(26,(SELECT ingredient_id FROM ingredients WHERE name='초코 파우더'),25)
        ,(26,(SELECT ingredient_id FROM ingredients WHERE name='우유'),220)
        ,(26,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 27. 화이트 초콜릿 라떼
        ,(27,(SELECT ingredient_id FROM ingredients WHERE name='화이트초코 시럽'),25)
        ,(27,(SELECT ingredient_id FROM ingredients WHERE name='우유'),220)
        ,(27,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 28. 흑당 버블 밀크티
        ,(28,(SELECT ingredient_id FROM ingredients WHERE name='홍차 티백'),1)
        ,(28,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180)
        ,(28,(SELECT ingredient_id FROM ingredients WHERE name='흑당 시럽'),30)
        ,(28,(SELECT ingredient_id FROM ingredients WHERE name='버블펄'),60)
        ,(28,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 29. 고구마 라떼
        ,(29,(SELECT ingredient_id FROM ingredients WHERE name='밀크 파우더'),25)
        ,(29,(SELECT ingredient_id FROM ingredients WHERE name='우유'),220)
        ,(29,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 30. 민트 초코 라떼
        ,(30,(SELECT ingredient_id FROM ingredients WHERE name='민트초코 파우더'),25)
        ,(30,(SELECT ingredient_id FROM ingredients WHERE name='우유'),220)
        ,(30,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- =========================
-- ADE
-- =========================

-- 31. 레몬 에이드
     ,(31,(SELECT ingredient_id FROM ingredients WHERE name='레몬청'),50)
     ,(31,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(31,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(31,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- 32. 자몽 에이드
     ,(32,(SELECT ingredient_id FROM ingredients WHERE name='자몽청'),50)
     ,(32,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(32,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(32,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- 33. 청포도 에이드
     ,(33,(SELECT ingredient_id FROM ingredients WHERE name='청포도청'),50)
     ,(33,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(33,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(33,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- 34. 블루레몬 에이드
     ,(34,(SELECT ingredient_id FROM ingredients WHERE name='레몬청'),30)
     ,(34,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(34,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(34,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- 35. 유자 에이드
     ,(35,(SELECT ingredient_id FROM ingredients WHERE name='유자청'),50)
     ,(35,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(35,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(35,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- =========================
-- JUICE
-- =========================

-- 36. 오렌지 주스
     ,(36,(SELECT ingredient_id FROM ingredients WHERE name='오렌지'),180)
     ,(36,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(36,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),100)

-- 37. 토마토 주스
     ,(37,(SELECT ingredient_id FROM ingredients WHERE name='토마토'),200)
     ,(37,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(37,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),100)

-- 38. 키위 주스
     ,(38,(SELECT ingredient_id FROM ingredients WHERE name='키위'),180)
     ,(38,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(38,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),100)

-- 39. 수박 주스
     ,(39,(SELECT ingredient_id FROM ingredients WHERE name='수박'),250)
     ,(39,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(39,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),100)

-- 40. 자몽 주스
     ,(40,(SELECT ingredient_id FROM ingredients WHERE name='자몽'),180)
     ,(40,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(40,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),100)

-- =========================
-- BLENDED
-- =========================

-- 41. 초코 프라페
     ,(41,(SELECT ingredient_id FROM ingredients WHERE name='초코 파우더'),30)
     ,(41,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180)
     ,(41,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),200)
     ,(41,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 42. 민트 초코 프라페
     ,(42,(SELECT ingredient_id FROM ingredients WHERE name='민트초코 파우더'),30)
     ,(42,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180)
     ,(42,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),200)
     ,(42,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 43. 쿠키앤크림 프라페
     ,(43,(SELECT ingredient_id FROM ingredients WHERE name='쿠키앤크림 파우더'),30)
     ,(43,(SELECT ingredient_id FROM ingredients WHERE name='쿠키 크럼블'),20)
     ,(43,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180)
     ,(43,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),200)
     ,(43,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 44. 카라멜 프라페
     ,(44,(SELECT ingredient_id FROM ingredients WHERE name='카라멜 시럽'),25)
     ,(44,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180)
     ,(44,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),200)
     ,(44,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 45. 말차 프라페
     ,(45,(SELECT ingredient_id FROM ingredients WHERE name='말차 파우더'),25)
     ,(45,(SELECT ingredient_id FROM ingredients WHERE name='우유'),180)
     ,(45,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),200)
     ,(45,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 46. 망고 스무디
     ,(46,(SELECT ingredient_id FROM ingredients WHERE name='망고'),120)
     ,(46,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(46,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 47. 딸기 스무디
     ,(47,(SELECT ingredient_id FROM ingredients WHERE name='딸기'),120)
     ,(47,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(47,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 48. 블루베리 스무디
     ,(48,(SELECT ingredient_id FROM ingredients WHERE name='블루베리'),120)
     ,(48,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(48,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- =========================
-- YOGURT
-- =========================

-- 49. 플레인 요거트 스무디
     ,(49,(SELECT ingredient_id FROM ingredients WHERE name='플레인 요거트'),220)
     ,(49,(SELECT ingredient_id FROM ingredients WHERE name='요거트 파우더'),20)
     ,(49,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(49,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 50. 딸기 요거트 스무디
     ,(50,(SELECT ingredient_id FROM ingredients WHERE name='플레인 요거트'),220)
     ,(50,(SELECT ingredient_id FROM ingredients WHERE name='딸기'),80)
     ,(50,(SELECT ingredient_id FROM ingredients WHERE name='요거트 파우더'),20)
     ,(50,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(50,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 51. 블루베리 요거트 스무디
     ,(51,(SELECT ingredient_id FROM ingredients WHERE name='플레인 요거트'),220)
     ,(51,(SELECT ingredient_id FROM ingredients WHERE name='블루베리'),80)
     ,(51,(SELECT ingredient_id FROM ingredients WHERE name='요거트 파우더'),20)
     ,(51,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(51,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 52. 망고 요거트 스무디
     ,(52,(SELECT ingredient_id FROM ingredients WHERE name='플레인 요거트'),220)
     ,(52,(SELECT ingredient_id FROM ingredients WHERE name='망고'),80)
     ,(52,(SELECT ingredient_id FROM ingredients WHERE name='요거트 파우더'),20)
     ,(52,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(52,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- =========================
-- DESSERT
-- =========================

-- 53. 뉴욕 치즈케이크
     ,(53,(SELECT ingredient_id FROM ingredients WHERE name='뉴욕 치즈케이크'),1)

-- 54. 초코 브라우니
     ,(54,(SELECT ingredient_id FROM ingredients WHERE name='브라우니'),1)

-- 55. 티라미수
     ,(55,(SELECT ingredient_id FROM ingredients WHERE name='티라미수'),1)

-- 56. 마카롱 세트
     ,(56,(SELECT ingredient_id FROM ingredients WHERE name='마카롱'),3)

-- 57. 그래놀라 요거트
     ,(57,(SELECT ingredient_id FROM ingredients WHERE name='플레인 요거트'),150)
     ,(57,(SELECT ingredient_id FROM ingredients WHERE name='그래놀라'),40)

-- =========================
-- BAKERY
-- =========================

-- 58. 버터 크루아상
     ,(58,(SELECT ingredient_id FROM ingredients WHERE name='버터 크루아상'),1)

-- 59. 플레인 베이글
     ,(59,(SELECT ingredient_id FROM ingredients WHERE name='플레인 베이글'),1)

-- 60. 에그 샌드위치
     ,(60,(SELECT ingredient_id FROM ingredients WHERE name='식빵'),2)
     ,(60,(SELECT ingredient_id FROM ingredients WHERE name='버터'),10)

-- 61. 햄치즈 샌드위치
     ,(61,(SELECT ingredient_id FROM ingredients WHERE name='식빵'),2)
     ,(61,(SELECT ingredient_id FROM ingredients WHERE name='햄'),40)
     ,(61,(SELECT ingredient_id FROM ingredients WHERE name='슬라이스 치즈'),20)
     ,(61,(SELECT ingredient_id FROM ingredients WHERE name='버터'),10)

-- 62. 갈릭 브레드
     ,(62,(SELECT ingredient_id FROM ingredients WHERE name='식빵'),2)
     ,(62,(SELECT ingredient_id FROM ingredients WHERE name='버터'),15)

-- =========================
-- SEASON
-- =========================

-- 63. 애플망고 빙수
     ,(63,(SELECT ingredient_id FROM ingredients WHERE name='애플망고'),150)
     ,(63,(SELECT ingredient_id FROM ingredients WHERE name='우유'),150)
     ,(63,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),250)
     ,(63,(SELECT ingredient_id FROM ingredients WHERE name='휘핑크림'),30)

-- 64. 딸기 빙수
     ,(64,(SELECT ingredient_id FROM ingredients WHERE name='딸기'),150)
     ,(64,(SELECT ingredient_id FROM ingredients WHERE name='우유'),150)
     ,(64,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),250)
     ,(64,(SELECT ingredient_id FROM ingredients WHERE name='휘핑크림'),30)

-- 65. 수박 빙수
     ,(65,(SELECT ingredient_id FROM ingredients WHERE name='수박'),180)
     ,(65,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),250)
     ,(65,(SELECT ingredient_id FROM ingredients WHERE name='휘핑크림'),30)

-- 66. 체리 에이드
     ,(66,(SELECT ingredient_id FROM ingredients WHERE name='체리'),60)
     ,(66,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(66,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(66,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)

-- 67. 복숭아 스무디
     ,(67,(SELECT ingredient_id FROM ingredients WHERE name='복숭아'),120)
     ,(67,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180)
     ,(67,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)

-- 68. 체스트넛 크림 라떼
     ,(68,(SELECT ingredient_id FROM ingredients WHERE name='에스프레소 원두'),18)
     ,(68,(SELECT ingredient_id FROM ingredients WHERE name='우유'),200)
     ,(68,(SELECT ingredient_id FROM ingredients WHERE name='밤크림'),30)
     ,(68,(SELECT ingredient_id FROM ingredients WHERE name='HOT 컵'),1)

-- 69. 유자 스파클링
     ,(69,(SELECT ingredient_id FROM ingredients WHERE name='유자청'),50)
     ,(69,(SELECT ingredient_id FROM ingredients WHERE name='탄산수'),250)
     ,(69,(SELECT ingredient_id FROM ingredients WHERE name='ICE 컵'),1)
     ,(69,(SELECT ingredient_id FROM ingredients WHERE name='얼음'),180);