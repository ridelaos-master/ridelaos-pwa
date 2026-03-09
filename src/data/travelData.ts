/* ──────────────────────────────────────────────
   Travel Info 데이터 — 한국어 + 영어
   ────────────────────────────────────────────── */

export interface InfoSection {
  title: string
  items: string[]
}

export interface CategoryData {
  summary: string
  sections: InfoSection[]
  tip: string
}

export const CATEGORY_META: Record<string, { icon: string }> = {
  weather:            { icon: '🌤️' },
  'rider-routes':     { icon: '🗺️' },
  money:              { icon: '💰' },
  telecom:            { icon: '📱' },
  bike:               { icon: '🏍️' },
  riding:             { icon: '⛽' },
  medical:            { icon: '🏥' },
  food:               { icon: '🍜' },
  history:            { icon: '🏛️' },
  language:           { icon: '🗣️' },
  visa:               { icon: '🛂' },
  packing:            { icon: '🎒' },
}

/* ══════════════════════════════════════════════
   한국어 데이터
   ══════════════════════════════════════════════ */
export const TRAVEL_DATA: Record<string, CategoryData> = {

  /* ───── 1. 날씨·시즌 ───── */
  weather: {
    summary: '라오스는 열대 몬순 기후로 건기(11~4월)와 우기(5~10월)로 나뉩니다. 오토바이 투어 최적 시즌은 11월~3월이며, 지역과 고도에 따라 기온 차이가 큽니다.',
    sections: [
      {
        title: '🗓️ 시즌별 특징',
        items: [
          '최적기 (11~2월): 맑은 날이 많고 도로 상태 양호. 투어 최적 시즌. 12~2월이 가장 쾌적하며 습도도 낮아 라이딩하기 좋습니다.',
          '우기 (5~10월): 거의 매일 오후 1~3시간 강한 스콜. 오전은 대체로 맑아 오전 라이딩 위주로 일정 조정 가능. 도로 미끄러움 주의.',
          '전환기 (3~4월, 10~11월): 3~4월은 화전(산을 태우는 농업)으로 북부 산간 지역의 미세먼지와 연기가 심합니다. N95급 방진 마스크 필수. 4월은 가장 더운 달(35~40°C). 10~11월은 우기 끝자락으로 녹음이 가장 아름다운 시기이지만 간헐적 비 주의.',
          '라오스 설날 삐마이라오 (4월 14~16일): 물 축제 기간. 도로에서 물세례를 받을 수 있어 라이딩 주의. 하지만 현지 문화 체험으로는 최고.',
        ],
      },
      {
        title: '🌡️ 월별 평균 기온 (비엔티안 기준)',
        items: [
          '11월: 25°C — 건기 시작, 선선하고 쾌적. 투어 시즌 개막',
          '12월: 22°C — 아침저녁 선선, 낮에도 덥지 않아 최적의 라이딩 컨디션',
          '1월: 20°C — 연중 가장 시원한 달. 북부 산간 지역은 아침 10°C까지 하락',
          '2월: 23°C — 건조하고 맑은 날 계속. 도로 컨디션 최상',
          '3월: 28°C — 기온 상승 시작. 아직은 쾌적하나 자외선 강해짐',
          '4월: 33°C — 연중 가장 더운 달. 체력 소모 크므로 충분한 수분 섭취 필수',
          '5~9월: 28~32°C — 높은 습도(80%+)와 스콜. 방수 장비 필수',
          '10월: 27°C — 우기 막바지. 비 줄어들기 시작하나 도로 상태 불량 구간 있음',
        ],
      },
      {
        title: '🏔️ 지역별 기온 차이',
        items: [
          '비엔티안 (해발 170m): 연중 고온다습. 가장 더운 지역. 30°C 전후',
          '방비엥 (해발 390m): 비엔티안보다 2~3°C 낮음. 강변이라 아침 안개 자주 발생',
          '루앙프라방 (해발 300m): 겨울(12~1월) 아침 최저 15°C까지 하락. 해질녘 급격히 서늘해짐',
          '볼라벤 고원 (해발 1,200m): 비엔티안보다 5~8°C 낮음. 연중 서늘하며 건기에도 아침저녁 재킷 필수. 커피 재배지답게 선선한 기후',
          '타켓 (해발 150m): 비엔티안과 비슷하나 계곡 지형이라 아침 안개 짙음. 동굴 내부는 연중 22~25°C',
          '시판돈/4000 아일랜드 (해발 80m): 가장 남쪽, 가장 더움. 연중 32~35°C. 메콩강 바람이 유일한 구원',
        ],
      },
      {
        title: '👕 시즌별 라이딩 복장',
        items: [
          '건기 (11~2월): 경량 라이딩 재킷 + 메쉬 이너. 볼라벤/루앙프라방은 경량 패딩 또는 플리스 추가. 아침 출발 시 장갑 필수',
          '건기 (3~4월): 메쉬 재킷 + 통풍 좋은 라이딩 팬츠. 자외선 차단 넥게이터. 1L 이상 물통 필수',
          '우기 (5~10월): 방수 라이딩 재킷 + 방수 부츠커버 + 방수 장갑. 짐 방수팩 필수. 고글/바이저 김서림 방지제',
          '공통: UV 차단 선글라스, 방수 선크림(SPF50+), 버프/넥게이터',
        ],
      },
    ],
    tip: '3~4월 루앙프라방 방면 투어 시, 뿌연 연기 때문에 시야 확보가 어렵고 호흡기가 따가울 수 있습니다. 안약과 고성능 마스크를 꼭 챙기세요!',
  },

  /* ───── 2. 지역 정보 (rider-routes) ───── */
  'rider-routes': {
    summary: '라오스는 남북으로 길게 뻗은 내륙국가입니다. Ride Laos 투어는 비엔티안을 거점으로 북부(방비엥, 루앙프라방)와 남부(볼라벤, 타켓, 시판돈)를 커버합니다.',
    sections: [
      {
        title: '🏙️ 비엔티안 (Vientiane)',
        items: [
          '라오스 수도이자 Ride Laos 사무실 소재지. 모든 투어의 출발/도착 거점',
          '인구 약 90만. 메콩강변의 조용하고 여유로운 동남아 수도',
          '주요 관광지: 탓루앙(That Luang, 황금 불탑), 빠뚜싸이(개선문), 왓시사켓(가장 오래된 사원), 부다파크',
          '한국 식당 10여 곳, 한인 마트, 한국어 가능 병원 있음',
          '국제공항(VTE)에서 시내까지 택시 20분. 투어 전날 도착하여 적응 추천',
          '야시장(나이트마켓): 메콩강변 일몰 감상 + 로컬 음식/기념품 쇼핑. 금토일 운영',
        ],
      },
      {
        title: '⛰️ 방비엥 (Vang Vieng)',
        items: [
          '비엔티안에서 156km (약 3~4시간). 13번 국도로 연결',
          '카르스트 석회암 지형이 만든 절경. "라오스의 하롱베이"로 불림',
          '블루라군 1~4호: 에메랄드빛 천연 수영장. 특히 3호가 한적하고 아름다움',
          '튜브 동굴: 튜브를 타고 동굴 속 지하수를 따라가는 체험. 우기 시 수위 주의',
          '남릭강 에코로지: 전기/와이파이 없는 자연 속 하룻밤. 별 관측 최적지',
          '어드벤처 코스의 핵심 구간. 비포장 트레일, 강 도하 구간 포함',
          '숙소: 강변 방갈로부터 럭셔리 리조트까지 다양. $10~$100/박',
        ],
      },
      {
        title: '🏛️ 루앙프라방 (Luang Prabang)',
        items: [
          '1995년 UNESCO 세계문화유산 등재. 라오스 문화·역사의 중심',
          '비엔티안에서 약 340km (국도 13번, 약 6~8시간 라이딩)',
          '탁발(새벽 공양): 매일 새벽 5:30~6:30, 승려 600여 명이 줄지어 탁발. 세계적으로 유명한 의식',
          '왕궁 박물관: 란쌍 왕국의 왕실 유물. 프라방 황금불상 보관',
          '꽝시 폭포: 시내에서 30km. 에메랄드빛 다단 폭포. 수영 가능. 오토바이 접근 최적',
          '야시장: 매일 밤 시사방봉 거리. 수공예품, 라오스 실크, 종이 공예',
          '빠꾸 동굴: 메콩강 보트로 2시간. 수천 개의 불상이 모셔진 석회암 동굴',
          '프랑스 식민지 건축물 + 라오스 전통 사원이 공존하는 독특한 도시 경관',
        ],
      },
      {
        title: '🌿 볼라벤 고원 (Bolaven Plateau)',
        items: [
          '해발 1,200m 고원. 라오스 최고의 커피 산지 (아라비카 원두)',
          '팍세에서 출발. 소형 루프(1일) 또는 대형 루프(2~3일) 가능',
          '탓판 폭포: 낙차 120m. 라오스 최대 폭포. 건기에도 수량 풍부',
          '탓쎄 폭포: 탓판에서 가까움. 수영 가능한 아래쪽 풀장이 인기',
          '커피 농장 투어: 라오스 커피 수확~로스팅 과정 체험. 시음 포함',
          '소수민족 마을: 까뚜(Katu), 알락(Alak) 등 전통 생활 방식 유지. 방문 시 예의 중요',
          '사진 촬영 포인트 최다. 재방문 고객 만족도 가장 높은 코스',
          '도로 상태: 대부분 포장이나 산간 구간 일부 비포장. 우기 시 미끄러움 주의',
        ],
      },
      {
        title: '🕳️ 타켓 (Thakhek) & 타켓 루프',
        items: [
          '타켓 루프: 약 450km 순환 코스. 라오스 중부의 석회암 절경',
          '콩로르 동굴 (Tham Kong Lo): 길이 7.5km의 거대 수중 동굴. 보트로 관통. 라오스 최고의 자연 경이',
          '메콩강변 도시 타켓: 태국 나콘파놈이 강 건너편에 보이는 국경 도시',
          '루프 방향: 반시계 방향(서→남→동→북) 추천. 경사와 경치 배분이 좋음',
          '숙소: 기본적인 게스트하우스 위주. 에어컨 없는 곳도 있으므로 사전 확인',
          '12번 국도: 루프의 동쪽 구간. 석회암 절벽 사이 와인딩 도로. 절경 포인트 다수',
          '완주하면 진짜 라이더! Ride Laos 라이더스 인증서 발급',
        ],
      },
      {
        title: '🏝️ 남부: 팍세 & 시판돈 (4000 아일랜드)',
        items: [
          '팍세 (Pakse): 남부 라오스 관문 도시. 볼라벤/타켓 코스 거점. 공항 있음 (PKZ)',
          '시판돈: 메콩강이 수천 개 섬으로 갈라지는 지역. "4000개의 섬"이라는 뜻',
          '돈뎃/돈콘: 가장 인기 있는 섬. 해먹에 누워 메콩강 감상하는 극한의 휴식',
          '리피 폭포(Liphi Falls): "동남아의 나이아가라". 수량이 어마어마',
          '콘파펭 폭포: 동남아 최대 폭포 (너비). 건기에 가장 장관',
          '이라와디 돌고래: 멸종 위기 민물 돌고래 관찰 가능 (12~5월 최적)',
          '라오스 종단 코스의 종착지. 비엔티안에서 여기까지 오면 진정한 완주',
        ],
      },
    ],
    tip: '각 도시 간 이동은 오토바이로 3~6시간. Ride Laos는 중간 휴식 포인트를 미리 설정하고, 피로 누적을 방지하기 위해 하루 최대 250km 이내로 일정을 설계합니다.',
  },

  /* ───── 3. 환전·결제 ───── */
  money: {
    summary: '라오스 공식 통화는 킵(LAK)이지만, 관광지에서는 USD와 태국 바트(THB)도 널리 통용됩니다. 최근 현금보다 QR 결제가 대세로 자리잡았으니, 현지 결제 앱을 세팅해 오시면 매우 편리합니다.',
    sections: [
      {
        title: '💵 통화 기본 정보',
        items: [
          '공식 통화: 라오스 킵 (LAK, ₭). 지폐: 500, 1,000, 2,000, 5,000, 10,000, 20,000, 50,000, 100,000 킵',
          '환율 (2025년 기준): 1 USD ≈ 20,500 LAK / 1,000원 ≈ 15,000 LAK',
          'USD 통용: 숙소, 투어, 렌트, 관광지 입장료 등 대부분 USD 결제 가능. 거스름돈은 킵으로 받음',
          'THB(태국 바트): 국경 지역(비엔티안, 타켓)에서 사용 가능. 1 THB ≈ 600 LAK',
          '원화(KRW): 라오스에서 직접 사용/환전 불가. 한국에서 USD로 미리 환전 추천',
        ],
      },
      {
        title: '🏦 환전 방법',
        items: [
          '한국 출발 전: 인천공항 또는 시중은행에서 USD 환전 (가장 유리)',
          '비엔티안 시내: 탈랏싸오(Talat Sao) 시장 근처 환전소가 환율 가장 좋음',
          '공항 환전: 가능하나 환율 불리. 택시비 정도만 환전 추천',
          '호텔/게스트하우스: 환전 가능하나 환율 나쁨. 비상시에만 이용',
          '루앙프라방: 시내 환전소 다수. 비엔티안보다 약간 불리하지만 큰 차이 없음',
          '볼라벤/타켓: 환전소 거의 없음. 비엔티안/팍세에서 미리 환전 필수',
        ],
      },
      {
        title: '🏧 ATM 이용',
        items: [
          '비엔티안/루앙프라방: ATM 다수 (BCEL, Lao Development Bank 등). Visa/Master 인출 가능',
          '1회 인출 한도: 최대 2,000,000 LAK (약 $100). 수수료 20,000 LAK (약 $1)',
          '하루 인출 한도: 보통 $300~$500 (카드사마다 다름)',
          '시골 지역: ATM 거의 없음. 방비엥에 2~3대, 타켓에 1~2대. 볼라벤 산간 지역은 전무',
          '주의: ATM 고장이 잦고 현금 소진 상태인 경우도 많음. 한 곳에서 안 되면 다른 ATM 시도',
          '해외 인출 수수료: 한국 카드사 수수료 + 라오스 현지 수수료 이중 부과. 한 번에 최대한 인출하는 것이 유리',
        ],
      },
      {
        title: '📱 필수! QR 결제 (Loca Pay 등)',
        items: [
          '라오스 결제 트렌드: 노점상, 시골 구멍가게, 주유소 등 90% 이상 상점에서 QR 결제(LAO QR) 사용',
          '관광객 세팅: 한국에서 Loca(라오스 모빌리티 앱) 설치 후 트래블월렛 등 해외 결제 카드 등록하면 Loca Pay로 QR 결제 가능',
          '장점: 거스름돈 실랑이/위조지폐 걱정 없고, 두꺼운 돈다발 필요 없어 라이더에게 최적',
        ],
      },
      {
        title: '💳 카드 결제',
        items: [
          '비엔티안/루앙프라방: 중급 이상 호텔, 레스토랑에서 Visa/Mastercard 가능',
          '방비엥: 일부 리조트만 카드 가능. 대부분 현금',
          '시골 지역: 100% 현금만 가능. 카드 결제 불가',
          '주유소: 대형 Shell/PetroTrade는 카드 가능한 곳도 있으나 확실하지 않음. 현금 준비',
          '카카오페이/삼성페이: 라오스에서 사용 불가',
        ],
      },
      {
        title: '💡 예산 가이드 (1인/1일)',
        items: [
          '숙소: $10~$30 (게스트하우스~중급 호텔). 투어 시 숙소비 포함',
          '식사: $5~$15 (로컬 식당 $2~5, 관광지 레스토랑 $5~15)',
          '음료/간식: $3~$5 (비어라오 대병 $1~2, 커피 $1~2)',
          '기름값: 약 $5~$8/일 (CRF250L 기준 하루 150km 주행 시)',
          '입장료: 평균 20,000~30,000 LAK ($1~1.5). 꽝시 폭포 등 유명 관광지는 더 비쌈',
          '투어 외 개인 경비: 1일 $20~$40 정도면 넉넉',
        ],
      },
    ],
    tip: '한국에서 미리 Loca 앱을 깔고 카드를 연동해 오세요! 스마트폰 하나로 현지인처럼 쿨하게 결제할 수 있습니다.',
  },

  /* ───── 4. 통신·인터넷 ───── */
  telecom: {
    summary: '라오스의 통신 인프라는 도시 중심으로 발달해 있습니다. 시골 지역에서는 3G도 불안정한 곳이 많으므로 오프라인 준비가 필수입니다.',
    sections: [
      {
        title: '📡 통신사 & 유심',
        items: [
          '주요 통신사: Unitel (추천, 가장 넓은 커버리지), Lao Telecom (LTC), ETL',
          'Unitel 관광객용 유심: 공항 도착 로비 부스에서 구매. 7일 5GB 약 $3~5, 30일 15GB 약 $8~10',
          '구매 시 여권 필요. 직원이 개통까지 해줌 (5분 소요)',
          '충전(Top-up): 편의점, 미니마트에서 충전 카드 구매. 금액별 다양 (10,000~100,000 LAK)',
          '번호 유지: 30일 이상 미사용 시 번호 자동 해지될 수 있음',
        ],
      },
      {
        title: '📲 eSIM',
        items: [
          '사전 구매 가능: Airalo, Holafly, Nomad 등에서 라오스 eSIM 판매',
          'Airalo 라오스: 1GB/7일 약 $4.5, 3GB/30일 약 $8',
          '장점: 한국 번호 유지하면서 데이터 사용 가능 (듀얼심)',
          '단점: 현지 전화/문자 불가. 데이터만 가능',
          '주의: 라오스 커버리지 확인 필수. 일부 eSIM은 비엔티안 외 지역 연결 불량',
          '추천: 도시에서는 eSIM, 시골 라이딩 구간에서는 Unitel 유심이 더 안정적',
        ],
      },
      {
        title: '📶 지역별 인터넷 상황',
        items: [
          '비엔티안: 4G LTE 안정. 카페/호텔 와이파이 양호 (5~20Mbps)',
          '루앙프라방: 시내 4G 양호. 교외 3G. 와이파이 보통 (3~10Mbps)',
          '방비엥: 시내 4G. 블루라군/동굴 지역은 3G~무신호',
          '볼라벤 고원: 팍세 출발 후 30분이면 3G. 산간 마을은 무신호 구간 1~2시간',
          '타켓 루프: 타켓 시내만 4G. 루프 대부분 3G~무신호. 콩로르 동굴 내부 완전 무신호',
          '시판돈: 돈뎃/돈콘 메인 구역만 3G. 속도 매우 느림',
        ],
      },
      {
        title: '📱 유용한 앱 & 오프라인 준비',
        items: [
          'Maps.me: 라오스 지도 오프라인 다운로드 필수. 시골 도로까지 상세히 표시',
          'Ride Laos 앱: 코스별 오프라인 지도 내장. 미리 다운로드하세요',
          'Google Maps: 오프라인 저장 가능하나 라오스 시골은 Maps.me가 더 정확',
          '카카오톡: 도시에서 정상 사용. 시골에서는 텍스트만 겨우 가능. 사진/영상 전송 어려움',
          'Google 번역: 라오스어 오프라인 팩 미리 다운로드. 식당/정비소에서 유용',
          'Grab: 비엔티안에서만 사용 가능. 택시/배달 앱',
        ],
      },
    ],
    tip: '출발 전 반드시 오프라인 지도를 다운로드하세요! Ride Laos 앱 + Maps.me 두 가지를 준비하면 무신호 구간에서도 안심입니다. 가이드가 별도 위성 통신 장비를 휴대합니다.',
  },

  /* ───── 5. 오토바이 정비 (bike) ───── */
  bike: {
    summary: 'Ride Laos는 Honda CRF250L/300L을 주력으로 운영합니다. CRF 시리즈는 오프로드에 최적화된 스포크 휠 + 튜브 타이어를 사용합니다. 모든 바이크는 투어 출발 전 풀 체크를 거치며, 투어 중에도 가이드가 매일 점검합니다.',
    sections: [
      {
        title: '🔧 투어 바이크 소개',
        items: [
          'Honda CRF250L: 주력 투어 바이크. 249cc 단기통, 24마력. 가볍고(144kg) 오프로드 성능 우수',
          'Honda CRF300L: CRF250L 업그레이드. 286cc, 27마력. 더 강한 토크로 언덕 주행 편안',
          'Honda Wave 125: 시내/근교 투어용. 125cc, 자동 클러치. 초보자 친화적',
          '모든 바이크 공통: ABS 장착 (또는 CBS), 사이드백 거치대, USB 충전 포트',
          '타이어: Dunlop D605 (듀얼퍼포즈). 포장/비포장 모두 대응',
          '타이어 특성: 스포크 휠과 튜브 타이어 장착. 일반 펑크 수리용 지렁이(플러그)로는 수리 불가능',
        ],
      },
      {
        title: '✅ 출발 전 풀 체크 항목',
        items: [
          '엔진 오일: 레벨 확인 + 색상 점검. 투어 전 교체 완료',
          '타이어: 공기압 (앞 1.75, 뒤 2.0 kgf/cm²), 트레드 잔여량, 손상 여부',
          '체인: 장력(15~25mm 유격), 윤활 상태, 스프로킷 마모도',
          '브레이크: 앞뒤 패드 잔여량, 브레이크 액 레벨, 작동 테스트',
          '라이트: 전조등, 미등, 브레이크등, 방향지시등 전수 점검',
          '클러치/스로틀: 케이블 유격 조정, 작동 부드러움 확인',
          '냉각수: 레벨 확인 (CRF250L 수랭식)',
          '너트/볼트: 핸들바, 미러, 발판, 머드가드 등 전체 토크 체크',
        ],
      },
      {
        title: '🔍 라이딩 중 일일 점검 (가이드가 수행)',
        items: [
          '매일 아침: 타이어 공기압 (눈으로 확인), 체인 장력, 오일 누유 여부',
          '비포장 구간 후: 체인 윤활, 타이어 손상 체크, 언더가드 점검',
          '우기 라이딩 후: 체인 세척+재윤활, 브레이크 작동 확인, 에어필터 상태',
          '매 주유 시: 전체 외관 점검, 이상 소음 유무 확인',
          '참가자 역할: 이상 느낌(소음, 진동, 핸들 쏠림) 있으면 즉시 가이드에게 보고',
        ],
      },
      {
        title: '🛞 현지 정비 & 비상 대처',
        items: [
          '펑크 수리: 시골에도 "ປິ້ນ(삔)" 간판 (타이어 수리점) 다수. 수리비 20,000~50,000 LAK ($1~2.5)',
          '체인 교체: 주요 도시 Honda 대리점에서 가능. 부품 재고 보통 있음',
          '오일 교환: 어디서든 가능. Honda Genuine Oil 또는 동급 사용',
          'Ride Laos 긴급 지원: 24시간 전화 운영. 지원 차량 + 예비 바이크 출동 가능 (투어 참가자 전용)',
          '보험: 바이크 기본 보험 포함. 차량 파손 시 참가자 부담 한도 있음 (사전 안내)',
          '주유소 정비: 일부 주유소에 간단 정비 가능. 체인 윤활, 공기압 보충 정도',
          '스페어 튜브 필수: 장거리 투어 시 전/후륜 스페어 튜브와 타이어 레버(주걱)를 반드시 준비',
          '시골 수리점에서 부품(튜브)만 주면 공임 1~2달러로 타이어 분해 후 교체해줌',
        ],
      },
      {
        title: '⚠️ 라이딩 안전 수칙',
        items: [
          '헬멧: 항상 착용. Ride Laos 제공 풀페이스 또는 개인 헬멧 사용',
          '보호구: 무릎/팔꿈치 보호대 제공. 라이딩 장갑 필수',
          '오프로드: 반드시 스탠딩 자세. 가이드가 출발 전 브리핑에서 교육',
          '음주 라이딩: 절대 금지. 전날 과음도 자제 권고',
          '피로 관리: 2시간 라이딩 후 15분 휴식 원칙. 졸리면 즉시 정차',
          '그룹 라이딩: 앞차와 3~5초 간격 유지. 추월 시 가이드에게 수신호',
        ],
      },
    ],
    tip: '펑크가 났을 때 무리하게 주행하면 튜브가 찢어지고 휠이 망가집니다. 즉시 멈추고 가까운 마을 삔(수리점)으로 이동하세요.',
  },

  /* ───── 6. 주유·도로 (riding) ───── */
  riding: {
    summary: '라오스 도로는 주요 국도 위주로 포장되어 있으나, 투어 코스에는 비포장 구간이 포함됩니다. 주유소는 도시 간 30~50km 간격으로 있으나 시골에서는 더 멀 수 있습니다.',
    sections: [
      {
        title: '🛣️ 주요 도로 & 상태',
        items: [
          '고속도로 진입 금지: 비엔티안-방비엥 고속도로는 이륜차 진입 엄격 금지. 구글 지도에서 반드시 유료도로 제외 설정 후 13번 국도 이용',
          '13번 국도 (비엔티안↔루앙프라방): 라오스 대동맥. 2차선 아스팔트. 비엔티안~방비엥 156km 구간 최근 확장 공사 완료. 양호한 상태. 중국행 대형 화물트럭이 많고 무리한 중앙선 침범 추월이 잦아 항상 방어 운전 필수',
          '13번 국도 (방비엥↔루앙프라방): 산악 와인딩. 포장 양호하나 커브 많고 화물차 주의. 절경 구간',
          '1D번 도로 (방비엥 루프): 비포장 + 포장 혼합. 카르스트 지형 사이 어드벤처 코스. 우기 시 일부 구간 통행 어려움',
          '12번 국도 (타켓 루프 동쪽): 석회암 절벽 사이 와인딩. 포장 양호. 라오스에서 가장 아름다운 도로 중 하나',
          '20번 도로 (볼라벤 루프): 팍세 출발. 대부분 포장. 커피 농장~폭포 구간. 산간 일부 비포장',
          '비포장 도로: 방비엥 오프로드, 볼라벤 산간, 타켓 루프 일부. 건기에는 먼지, 우기에는 진흙',
        ],
      },
      {
        title: '⛽ 주유 가이드',
        items: [
          '주유소 브랜드: PetroTrade (국영, 가장 많음), Shell, PTT (태국계). PTT 주유소가 시설 가장 좋음. Cafe Amazon 병설 (에어컨/깨끗한 화장실)',
          '가솔린 종류: Regular 91 (CRF250L/300L 사용), Premium 95',
          '가격: Regular 약 13,000~15,000 LAK/리터 (약 $0.65~0.75). 한국의 1/3 수준',
          'CRF250L 연비: 약 30~35km/L. 탱크 7.7L. 만탱 시 약 230~270km 주행 가능',
          '도시 간 주유소 간격: 국도변 평균 30~50km. 충분한 편',
          '시골/산간 지역: 50~80km 간격. 출발 전 반드시 만탱',
          '병주유 (도로변 유리병): 시골에서 흔히 보이는 유리병에 담긴 기름. 긴급시 사용 가능하나 품질 불확실. 가격 약간 비쌈',
          '팁: 연료 게이지가 1/3 이하로 내려가면 다음 주유소에서 반드시 주유. 가이드가 주유 타이밍 안내',
        ],
      },
      {
        title: '🚦 교통 법규 & 주의사항',
        items: [
          '통행 방향: 우측통행 (한국과 동일)',
          '헬멧: 착용 의무. 위반 시 벌금 (실제 단속은 비엔티안 시내 위주)',
          '면허: 국제운전면허증 필수 (오토바이 면허 포함). 경찰 검문 시 제시 필요',
          '속도 제한: 도시 40km/h, 국도 80km/h. 실제로는 도로 상태에 따라 30~60km/h',
          '음주 운전: 엄격히 금지. 혈중 알코올 0.05% 이상 시 벌금 + 면허 압수',
          '경찰 검문: 비엔티안 시내와 주요 도시 입구에서 간헐적. 면허증 + 여권 사본 항상 휴대',
          '사고 시: 즉시 Ride Laos 긴급번호 연락. 경찰 신고는 가이드가 대행',
          '야간 운전: 가로등 없는 도로 대부분. 소, 개 등 동물 출현 빈번. 원칙적으로 금지',
        ],
      },
      {
        title: '🐃 도로 위 주의 요소',
        items: [
          '동물: 소, 물소, 개, 닭이 도로에 자주 출현. 특히 아침/저녁. 속도 줄이고 경적',
          '화물차: 국도에서 대형 트럭/버스가 중앙선 침범하며 추월하는 경우 많음. 항상 우측 유지',
          '먼지: 비포장 도로에서 앞차 먼지 구름. 안전 거리 확보 + 고글 착용',
          '우기 도로: 포장 도로도 낙석, 산사태 흔적 있음. 웅덩이 깊이 확인 후 통과',
          '다리/강 도하: 건기에는 얕은 강 직접 통과 구간 있음. 가이드 먼저 통과 후 따라가기',
        ],
      },
    ],
    tip: '태국계 PTT 주유소의 Cafe Amazon은 라이더들의 오아시스입니다. 에어컨이 빵빵하고 화장실이 가장 깨끗하니 쉬어가기 좋습니다.',
  },

  /* ───── 7. 의료·안전 ───── */
  medical: {
    summary: '라오스의 의료 인프라는 제한적입니다. 가벼운 부상은 현지 치료 가능하나, 중상 시 태국 병원으로 이송이 필요할 수 있습니다. 여행자 보험 가입은 필수입니다.',
    sections: [
      {
        title: '🏥 의료 시설',
        items: [
          '비엔티안: Alliance International Medical Center (외국인 전용, 영어 가능), 마호솟 병원 (국립, 규모 큼)',
          '한국어 가능: 비엔티안 한인 클리닉 운영 중 (위치는 Ride Laos에서 안내)',
          '루앙프라방: 지방 병원 1곳. 기본적인 치료만 가능. 중상 시 비엔티안/태국 이송',
          '팍세: 지방 병원. 볼라벤/타켓 코스 중 가장 가까운 의료 시설',
          '시골 지역: 보건소(Health Center) 수준. 기본 응급 처치만 가능',
          '중상 시: 태국 우돈타니(비엔티안에서 1시간) 또는 방콕으로 긴급 이송. 보험 필수',
        ],
      },
      {
        title: '🛡️ 여행자 보험',
        items: [
          '필수 가입: 오토바이 투어 특성상 여행자 보험(오토바이 사고 보장 특약) 강력 권장',
          '추천 보험: 삼성화재, DB손보 등 해외여행보험 + 오토바이 특약. 또는 World Nomads',
          '보장 확인: 250cc 이상 오토바이 라이딩 보장 여부 반드시 확인. 일부 보험은 125cc까지만 보장',
          '국제운전면허증 없이 사고 시 보험 적용 안 될 수 있음. 반드시 사전 발급',
          '의료 이송(Medical Evacuation) 보장 포함 여부 확인. 라오스→태국 이송비 $5,000~$20,000',
          'Ride Laos: 현지 기본 보험 제공. 개인 여행자 보험 추가 가입 강력 권장',
        ],
      },
      {
        title: '💊 상비약 & 건강 관리',
        items: [
          '필수 상비약: 소화제, 지사제(정로환), 해열진통제(타이레놀), 종합감기약, 밴드, 소독약, 모기 기피제',
          '항생제 연고: 상처 감염 예방 필수. 열대 기후에서 작은 상처도 빠르게 감염',
          '말라리아: 비엔티안/관광지는 위험 낮음. 볼라벤 산간 지역 주의. 모기 기피제 필수',
          '뎅기열: 우기(6~10월) 주의. 긴 소매/긴 바지 착용, 모기 기피제',
          '음식 주의: 생수만 마시기. 얼음은 도시에서는 대체로 안전. 시골에서는 주의',
          '탈수 방지: 라이딩 중 30분마다 수분 섭취. 경구수액(ORS) 패킷 가져가면 유용',
          '자외선: SPF50+ 선크림, UV 선글라스 필수. 특히 3~4월 자외선 극강',
        ],
      },
      {
        title: '🆘 긴급 연락처',
        items: [
          '경찰: 1191 (라오스 경찰 핫라인)',
          '앰뷸런스: 1195 (비엔티안 한정. 시골은 없음)',
          '소방: 1190',
          'Ride Laos 긴급 전화: 투어 참가자에게 별도 제공 (24시간 운영)',
          '한국 대사관 (비엔티안): +856-21-352-031~3 (근무시간), 긴급 +856-20-5551-2380',
          '태국 우돈타니 병원: +66-42-342-555 (라오스에서 가장 가까운 종합병원)',
        ],
      },
    ],
    tip: '가장 중요한 것은 "사고 예방"입니다. 과속하지 않고, 음주 후 라이딩 절대 금지, 피로할 때 무리하지 않기. Ride Laos 가이드의 안전 브리핑을 꼭 숙지해주세요!',
  },

  /* ───── 8. 음식·맛집 ───── */
  food: {
    summary: '라오스 음식은 태국 음식과 비슷하면서도 독자적인 매력이 있습니다. 카오니아오(찹쌀밥)를 기본으로 한 다양한 요리를 만나보세요.',
    sections: [
      {
        title: '🍚 라오스 대표 음식',
        items: [
          '카오니아오 (ເຂົ້າໜຽວ): 찹쌀밥. 라오스의 주식. 대나무 통에 담아 손으로 뜯어 먹음. 모든 요리와 함께',
          '라프 (ລາບ): 라오스 국민 음식. 다진 고기(닭/돼지/소)에 라임즙, 허브, 볶은 쌀가루를 넣은 샐러드. 매콤한 맛',
          '탐막훙 (ຕຳໝາກຫຸ່ງ): 파파야 샐러드. 태국의 솜탐과 비슷하나 더 짭짤하고 발효 생선 사용. 매운맛 강도 주문 가능',
          '카오삐약 (ເຂົ້າປຽກ): 라오스식 쌀국수. 닭 또는 돼지 육수에 쌀면. 아침 식사로 인기',
          '삔까이 (ປິ້ງໄກ່): 숯불 구이 닭. 도로변 포장마차에서 흔히 볼 수 있음. 찹쌀밥 + 탐막훙과 세트',
          '오람 (ເອາະລາມ): 라오스식 스튜. 고기, 채소, 허브를 끓인 걸쭉한 요리. 찹쌀밥과 최고 궁합',
          '씬댓 (ຊີ້ນແດດ): 라오스식 BBQ. 화로 위 고기 + 육수 샤부샤부 동시 진행. 그룹 투어 저녁으로 완벽',
        ],
      },
      {
        title: '🍺 라오스 음료',
        items: [
          '비어라오 (BeerLao): 라오스 국민 맥주. 라거 타입, 부드러운 맛. 대병 약 10,000~15,000 LAK ($0.5~0.75). 세계적으로 인정받는 맥주',
          '비어라오 다크: 흑맥주 버전. 도수 약간 높고 풍미 깊음. 마니아 다수',
          '라오라오 (ເຫລົ້າລາວ): 라오스 전통 쌀소주. 도수 40~50%. 시골 마을에서 환영 의식으로 제공. 한 잔은 예의',
          '라오스 커피: 볼라벤 고원 아라비카. 연유 넣은 아이스커피가 일반적. 에스프레소 스타일도 증가 추세',
          '프루트 셰이크: 열대 과일(망고, 파인애플, 패션프루트) 셰이크. 어디서든 10,000~20,000 LAK',
          '생수: 반드시 병물(bottled water) 마시기. 브랜드: Tigerhead, Dao 등. 500ml 약 3,000 LAK',
        ],
      },
      {
        title: '🍜 라이더 추천 식당',
        items: [
          '비엔티안: 꽁비엥 (Khong View) — 메콩강변 라오스 음식. 일몰 뷰 최고',
          '비엔티안: 코프짜이더 (Kop Chai Deu) — 외국인 인기 레스토랑. 다양한 라오스/서양 음식',
          '방비엥: 강변 레스토랑 — 남쏭강 뷰 + 라오스 BBQ. 이름 없는 곳도 맛있음',
          '루앙프라방: 야시장 뷔페 — 시사방봉 야시장에서 15,000 LAK에 접시 뷔페. 가성비 최고',
          '루앙프라방: 따마린드 (Tamarind) — 라오스 전통 음식 코스. 외국인 입맛에 맞게 조리',
          '볼라벤: 커피 농장 카페 — 직접 로스팅한 원두 커피 + 간단한 라오스 간식',
          '시골 도로변: 숯불 닭 + 찹쌀밥 포장마차 — 어디서든 만남. 20,000~30,000 LAK. 라이더 필수 경험',
        ],
      },
      {
        title: '⚠️ 음식 주의사항',
        items: [
          '위생: 도시 레스토랑은 대체로 안전. 시골 포장마차도 불 앞에서 바로 조리하면 OK',
          '생채소: 시골에서는 가급적 익힌 음식 추천. 도시에서는 관광지 레스토랑 생채소 대체로 안전',
          '얼음: 비엔티안/루앙프라방 등 도시는 공장 제빙이라 안전. 시골은 확인 필요',
          '매운맛: "매운맛 빼주세요"는 라오스어로 "보쌉 (ບໍ່ເຜັດ)". 그래도 한국인에게는 보통 맞음',
          '알레르기: 땅콩, 생선소스(빠댁) 많이 사용. 알레르기 있으면 사전에 가이드에게 알리기',
          '라이딩 전 식사: 과식 금지. 라이딩 1시간 전 가볍게 식사. 기름진 음식 피하기',
        ],
      },
    ],
    tip: '시골 도로변 숯불 닭(삔까이) + 찹쌀밥 + 탐막훙 조합은 라오스 투어의 진수입니다. 가이드가 검증된 맛집을 알려드리니 믿고 따라오세요!',
  },

  /* ───── 9. 역사·문화 ───── */
  history: {
    summary: '라오스는 "백만 마리 코끼리의 나라(란쌍)"라는 별명을 가진 불교 국가입니다. 프랑스 식민지, 인도차이나 전쟁의 역사를 거쳐 현재의 평화로운 나라가 되었습니다.',
    sections: [
      {
        title: '📜 라오스 역사 요약',
        items: [
          '란쌍 왕국 (1354~1707): 파응움 왕이 건국. "백만 마리 코끼리의 나라". 루앙프라방이 수도. 동남아 강국으로 번성',
          '분열 시대 (1707~1893): 루앙프라방, 비엔티안, 참파삭 3왕국으로 분열. 태국(시암)과 베트남의 영향권 아래 놓임',
          '프랑스 식민지 (1893~1953): 프랑스령 인도차이나에 편입. 프랑스 건축물이 루앙프라방/비엔티안에 남아 있음',
          '라오스 내전 & 비밀 전쟁 (1953~1975): 미국 CIA가 몽족을 지원하여 반공 게릴라전 수행. 세계에서 가장 많은 폭탄이 투하된 나라 (2억 톤 이상)',
          '라오인민민주공화국 (1975~현재): 공산주의 혁명으로 왕정 폐지. 현재도 1당 체제. 하지만 관광객에게는 매우 우호적이고 개방적',
          'UXO (불발탄): 전국에 아직 8,000만 개 추정 불발탄 잔존. 지정된 도로와 길만 다니기. 절대 밭/숲에 함부로 들어가지 않기',
        ],
      },
      {
        title: '🙏 불교 문화',
        items: [
          '소승불교(테라바다): 라오스 인구 65%가 불교도. 일상 생활에 깊이 스며든 종교',
          '탁발 (아침 공양): 매일 새벽 승려들이 줄지어 탁발. 루앙프라방이 가장 유명. 조용히 관람하고 사진 찍을 때 플래시 금지',
          '사원(왓) 방문 예절: 긴 소매/긴 바지 착용, 신발 벗기, 불상보다 머리를 낮게, 여성은 승려에게 직접 물건 전달 금지',
          '삐마이라오 (라오스 새해, 4월): 3일간의 물 축제. 사원에서 불상 세척 의식 + 거리에서 물 뿌리기 축제',
          '분방파이 (로켓 축제, 5~6월): 우기 시작을 알리는 축제. 자작 로켓 발사. 시골 마을에서 체험 가능',
          '분옥판싸 (안거 시작, 7월): 승려들이 3개월간 사원에 머무는 기간. 결혼식 등 행사 자제',
        ],
      },
      {
        title: '👥 라오스 사람들',
        items: [
          '인구: 약 740만 명. 49개 소수민족으로 구성',
          '라오룸(저지대 라오): 인구 60%. 메콩강 유역 거주. 주류 문화',
          '라오텅(중간 고지대): 인구 25%. 몬-크메르계. 볼라벤 고원 등',
          '라오숭(고지대): 인구 15%. 몽족, 야오족 등. 산간 마을에서 전통 문화 유지',
          '국민성: 매우 친절하고 느긋함. "보뻰냥(괜찮아요)"이 생활 철학. 급하게 서두르지 않는 문화',
          '인사: 합장(놉)으로 인사. "싸바이디(สະບາຍດີ)"가 기본 인사말',
          '존중: 머리를 만지지 않기 (머리는 신체 중 가장 신성한 부분). 발로 물건/사람을 가리키지 않기',
        ],
      },
    ],
    tip: '라오스에서는 "느림"이 매력입니다. 현지인의 속도에 맞추면 더 많은 것을 보고 느낄 수 있습니다. 오토바이로 시골 마을을 지날 때 손 흔들며 인사하면 100% 환한 미소로 답해줍니다!',
  },

  /* ───── 10. 라오스어 ───── */
  language: {
    summary: '라오스어는 태국어와 같은 어족에 속해 비슷한 부분이 많습니다. 관광지에서는 간단한 영어가 통하지만, 시골에서는 라오스어가 유일한 소통 수단입니다.',
    sections: [
      {
        title: '👋 기본 인사',
        items: [
          '안녕하세요: ສະບາຍດີ (싸바이디)',
          '감사합니다: ຂອບໃຈ (콥짜이)',
          '대단히 감사합니다: ຂອບໃຈຫຼາຍໆ (콥짜이 라이라이)',
          '괜찮습니다/천만에요: ບໍ່ເປັນຫຍັງ (보뻰냥)',
          '안녕히 가세요: ໂຊກດີ (쏙디) — "행운을 빕니다"라는 뜻',
          '네: ແມ່ນ (맨) / 아니오: ບໍ່ (보)',
          '죄송합니다: ຂໍໂທດ (코톳)',
        ],
      },
      {
        title: '⛽ 주유소·정비 관련',
        items: [
          '주유소: ປັ໊ມນ້ຳມັນ (뻠남만)',
          '기름 넣어주세요: ເອົານ້ຳມັນ (아오 남만)',
          '가득 채워주세요: ເຕັມ (뗌)',
          '타이어 펑크: ຢາງແບນ (양밴)',
          '수리점: ຮ້ານສ້ອມ (한 쏨)',
          '고장났어요: ເພ (패)',
          '도와주세요: ຊ່ວຍແດ່ (수아이 대)',
        ],
      },
      {
        title: '🍽️ 식당에서',
        items: [
          '맛있어요: ແຊບ (쌥!)',
          '매운맛 빼주세요: ບໍ່ເຜັດ (보펫)',
          '조금만 매운맛: ເຜັດໜ້ອຍ (펫 노이)',
          '밥(찹쌀): ເຂົ້າໜຽວ (카오 니아오)',
          '물: ນ້ຳ (남) / 맥주: ເບຍ (비아)',
          '계산서 주세요: ເກັບເງິນ (겝 응언)',
          '얼마예요?: ເທົ່າໃດ (타오다이?)',
          '비싸요: ແພງ (팽) / 깎아주세요: ລົດແດ່ (롯 대)',
        ],
      },
      {
        title: '🆘 긴급 상황',
        items: [
          '도와주세요!: ຊ່ວຍແດ່! (수아이 대!)',
          '병원: ໂຮງໝໍ (홍모)',
          '경찰: ຕຳຫຼວດ (땀루앗)',
          '아파요: ເຈັບ (쩹)',
          '위험해요: ອັນຕະລາຍ (안따라이)',
          '길을 잃었어요: ຫຼົງທາງ (롱탕)',
          '한국 대사관에 연락해주세요: ຕິດຕໍ່ສະຖານທູດເກົາຫຼີ (띳또 싸탄투웃 까올리)',
        ],
      },
      {
        title: '🔢 숫자',
        items: [
          '1: ໜຶ່ງ (능) / 2: ສອງ (쏭) / 3: ສາມ (싸암)',
          '4: ສີ່ (씨) / 5: ຫ້າ (하) / 6: ຫົກ (혹)',
          '7: ເຈັດ (쩻) / 8: ແປດ (빼앳) / 9: ເກົ້າ (까오) / 10: ສິບ (씹)',
          '20: ຊາວ (싸오) / 100: ຮ້ອຍ (호이) / 1,000: ພັນ (판)',
          '10,000: ໝື່ນ (믄) / 100,000: ແສນ (쌘) / 1,000,000: ລ້ານ (란)',
          '예: "50,000 킵" = 하 믄 (ຫ້າໝື່ນ)',
        ],
      },
    ],
    tip: '"싸바이디"와 "콥짜이"만 기억해도 라오스 여행이 10배 즐거워집니다! 시골 마을에서 라오스어로 인사하면 현지인들이 정말 기뻐합니다. 가이드가 필수 표현을 라이딩 중에 하나씩 알려드려요.',
  },

  /* ───── 11. 비자·입국 ───── */
  visa: {
    summary: '한국 여권 소지자는 관광 목적으로 라오스에 최대 30일간 무비자로 체류할 수 있습니다.',
    sections: [
      {
        title: '🛂 한국인 입국 조건',
        items: [
          '무비자 30일: 한국 국적자는 관광 목적으로 입국 시 최대 30일간 비자 없이 체류 가능합니다.',
          '여권 유효기간: 입국 시점 기준 6개월 이상 잔여 필수',
          '입국 시 필요서류: 여권, 왕복 항공권 (또는 출국 증빙), 숙소 예약 확인서 (요청 시)',
          '장기 체류 시: 30일을 초과할 경우 비엔티안 이민국에서 비자를 연장하거나, 태국 국경을 다녀오는 비자런(Visa Run)을 해야 합니다.',
        ],
      },
      {
        title: '✈️ 한국→라오스 항공편',
        items: [
          '직항: 인천→비엔티안 (진에어, 비엣젯 등. 약 5시간)',
          '경유: 방콕/하노이/호치민 경유 (대한항공, 아시아나, 타이항공 등)',
          '비엔티안 왓따이 국제공항 (VTE): 시내에서 차로 15~20분',
          '루앙프라방 공항 (LPQ): 방콕/하노이에서 직항 있음. 남부 투어 시 팍세 공항(PKZ)도 옵션',
          '항공권 가격: 직항 왕복 약 30~60만원 (시즌에 따라 변동)',
        ],
      },
      {
        title: '🛃 입국 절차',
        items: [
          '1. 입국카드 작성: 기내 또는 공항에서 배부. 영문으로 작성',
          '2. 이민 심사: 여권 + 입국카드 제출. 무비자 시 스탬프만 받음',
          '3. 수하물 수취: 일반적 절차',
          '4. 세관 신고: 특별한 물품 없으면 그냥 통과',
          '5. 유심 구매: 도착 로비 Unitel 부스에서 구매 (여권 필요)',
          '6. 환전/ATM: 공항 내 환전소 + ATM 있음',
          '7. 교통: 택시 (공항 카운터에서 요금 확인), Grab (앱)',
        ],
      },
      {
        title: '⚠️ 입국 주의사항',
        items: [
          '국제운전면허증: 한국에서 반드시 발급 후 출국. 라오스에서는 발급 불가. 경찰서나 도로교통공단에서 발급 ($7, 즉시 발급). A등급 이륜차 도장이 찍혀있는지 반드시 확인. 1종 보통 면허만 있으면 A란에 도장이 안 찍혀 무면허 적발됨',
          '출입국 카드: 출국 시 출국카드 제출 필요. 입국 시 받은 카드를 잘 보관',
          '초과 체류: 1일당 $10 벌금. 공항 출국 시 납부. 심한 경우 강제 출국 + 입국 금지',
          '금지 물품: 마약류 (라오스 마약법 매우 엄격, 사형 가능), 무기, 음란물',
          '반입 주의: 주류 1L, 담배 200개비까지. 고가 전자기기는 신고 권장',
          '환전 영수증: 킵→외화 재환전 시 환전 영수증 필요한 경우 있음. 보관 추천',
        ],
      },
    ],
    tip: '가장 많이 하는 실수! 국제운전면허증에 A(이륜차) 란에 도장이 찍혀 있는지 꼭 확인하세요. 1종 보통 면허만 있으면 A란에 도장이 찍히지 않아 라오스에서 오토바이를 몰면 무면허로 적발됩니다.',
  },

  /* ───── 12. 준비물·짐싸기 ───── */
  packing: {
    summary: '오토바이 투어 특성상 짐은 최소화하되, 안전 장비와 기후 대비 의류는 꼭 챙겨야 합니다. Ride Laos에서 헬멧, 보호구 등 기본 장비를 제공합니다.',
    sections: [
      {
        title: '🪖 라이딩 장비 (Ride Laos 제공)',
        items: [
          '헬멧: 풀페이스 제공 (개인 헬멧 사용 가능. Bluetooth 인터콤 호환 확인)',
          '무릎/팔꿈치 보호대: 기본 제공',
          '라이딩 장갑: 기본 제공 (개인 장갑 추천)',
          '사이드백: CRF250L/300L에 기본 장착',
          '방수 내부 라이너: 사이드백 내부 방수 커버 제공',
          '참가자 준비: 라이딩 재킷, 라이딩 부츠, 개인 장갑 (더 좋은 것 원할 경우)',
        ],
      },
      {
        title: '👕 의류 (계절 공통)',
        items: [
          '라이딩 재킷: 방풍/방수 기능. 메쉬 이너 탈착 가능한 것이 가장 유용',
          '라이딩 팬츠: 무릎 보호대 내장형 추천. 일반 긴 바지도 가능',
          '라이딩 부츠: 발목 보호 필수. 방수면 더 좋음. 없으면 최소 발목 위 등산화',
          '일상복: 투어 중 저녁/관광용. 반팔 2~3장, 긴 바지 1~2장',
          '경량 패딩/플리스: 볼라벤/루앙프라방 필수. 다른 코스도 아침 라이딩 시 유용',
          '비옷: Ride Laos 기본 제공. 개인용 고어텍스 재킷 있으면 더 좋음',
          '수영복: 블루라군, 꽝시 폭포 등 수영 포인트 다수',
          '속건 타올: 매우 유용. 빨리 마르는 여행용 타올 추천',
        ],
      },
      {
        title: '🎒 필수 소지품',
        items: [
          '여권 + 사본 2부: 원본은 방수팩에. 사본은 별도 보관',
          '국제운전면허증: 반드시 한국에서 발급',
          '여행자 보험 증서: 출력본 + 스마트폰 저장',
          '현금: USD $200~$300 + 한국 카드 (해외 인출 가능 확인)',
          '스마트폰 + 충전기 + 보조 배터리 (20,000mAh 이상 추천)',
          '방수폰케이스: 라이딩 중 비, 먼지 차단. 터치 가능한 것으로',
          '선글라스 (UV 차단): 필수. 라이딩 중 바람/먼지/자외선 차단',
          '귀마개: 장거리 라이딩 시 풍절음 차단. 청력 보호',
        ],
      },
      {
        title: '💊 의약품 & 위생',
        items: [
          '상비약: 소화제, 지사제, 해열진통제, 종합감기약, 알레르기약',
          '외상용: 밴드 (큰 것 포함), 소독약, 항생제 연고, 거즈/반창고',
          '기타: 모기 기피제 (DEET 30%+), 선크림 (SPF50+), 립밤',
          '개인 위생: 칫솔/치약, 면도기, 샴푸/비누 (시골 숙소에는 없을 수 있음)',
          '물티슈/손소독제: 시골 식당에서 매우 유용',
        ],
      },
      {
        title: '📱 전자기기',
        items: [
          '액션캠 (GoPro 등): 헬멧 마운트로 라이딩 영상 촬영. 투어의 꽃',
          '카메라: 풍경 촬영. 방수/방진 기능 있으면 더 좋음',
          'SD카드: 넉넉하게 (64GB+). 영상 촬영 시 빠르게 소모',
          '멀티 충전기: USB-C + USB-A 포트. 라오스 전압 220V (한국 플러그 그대로 사용 가능)',
          '보조 배터리: 20,000mAh 이상. 시골 숙소 전기 불안정할 수 있음',
          'Bluetooth 인터콤: 그룹 라이딩 시 가이드/동행과 통화용. 없어도 가이드가 수신호로 소통',
        ],
      },
      {
        title: '📦 짐 패킹 팁',
        items: [
          '백팩은 라이딩 시 어깨/허리에 무리. 사이드백 + 탱크백 활용 추천',
          '방수: 모든 짐을 방수백/지퍼백에 소분. 우기 아니어도 먼지 방지',
          '무게 분산: 사이드백 좌우 무게 균등하게. 무거운 것 아래쪽에',
          '접근성: 자주 쓰는 것(물, 선크림, 카메라)은 탱크백에',
          '여유 공간: 현지 구매품(커피, 기념품) 위한 빈 공간 남기기',
          '총 무게: 사이드백 합계 10kg 이내 추천. 무거우면 라이딩에 영향',
        ],
      },
    ],
    tip: '짐은 가볍게! "이것도 쓸 수 있을까?" 싶은 건 두고 오세요. 라오스에서 웬만한 것은 다 구할 수 있고, Ride Laos 가이드 차량에 여분 장비가 있습니다. 가장 중요한 건 여권, 국제운전면허증, 보험 증서 이 세 가지입니다!',
  },
}

/* ══════════════════════════════════════════════
   영어 데이터 (Batch 1: weather, regions, money)
   ══════════════════════════════════════════════ */
export const TRAVEL_DATA_EN: Record<string, CategoryData> = {

  /* ───── 1. Weather & Seasons ───── */
  weather: {
    summary: "Laos has two main seasons: the dry season (November–April) and the wet season (May–October). For motorcycle touring, the dry season is ideal — but each season has its own character.",
    sections: [
      {
        title: '☀️ Dry Season (November–April) — Prime Riding Season',
        items: [
          'November–February: Best overall riding conditions. Cool mornings (15–22°C in the north), warm afternoons (28–32°C in the south). Minimal rain. Excellent visibility.',
          'March–April: Hotter and drier. Temperatures climb to 35–40°C in the lowlands. Air quality can be affected by agricultural burning in the north — check conditions before riding the Luang Prabang route.',
          'Roads: Dry and generally in good condition. Dust can be an issue on unpaved tracks.',
          'Crowds: Peak tourist season November–January. Book accommodation in Luang Prabang well in advance.',
          'Ideal months for Ride Laos tours: December, January, February — perfect conditions across all routes.',
        ],
      },
      {
        title: '🌧️ Wet Season (May–October) — For Experienced Adventurers',
        items: [
          'May–October: Monsoon season. Daily afternoon rain showers, sometimes heavy. Roads can flood, especially in the south and on the Bolaven Plateau.',
          'Temperatures are slightly cooler (28–34°C) and humidity is high. Lush green landscapes — beautiful but challenging for riding.',
          'Road conditions: Unpaved tracks can become extremely muddy and impassable. Stick to main roads unless very experienced.',
          'September–October: Peak rainfall months. Some routes (Thakhek Loop off-road sections) may be inaccessible.',
          'Flooding: River crossings that are trivial in dry season can be dangerous. Never attempt a flooded road crossing.',
          'Upside: Far fewer tourists, lower prices, and the landscape is stunningly green.',
        ],
      },
      {
        title: '🌡️ Regional Climate Differences',
        items: [
          'Vientiane and central Laos: Hot and dry November–April. Humid and wet May–October.',
          'Northern highlands (Luang Prabang, Vang Vieng): Cooler year-round due to elevation. Cold mornings December–February (can drop to 10°C at night in the mountains).',
          'Bolaven Plateau (southern highlands): Cooler than surrounding lowlands. Heaviest rainfall in Laos during wet season — over 3,000mm annually.',
          'Thakhek and southern Laos: Very hot in March–April. Mild and pleasant November–February.',
        ],
      },
      {
        title: '🌫️ Air Quality',
        items: [
          'February–April: Agricultural burning season. Smoke from slash-and-burn farming affects air quality across northern Laos — particularly Luang Prabang, Vang Vieng, and mountain routes.',
          'Impact on riding: Visibility can be reduced. Buff or mask recommended for northern routes in these months.',
          'AQI monitoring: Check iqair.com or airvisual for real-time air quality before northern routes in dry season.',
          'Southern Laos (Pakse, Bolaven): Less affected by burning season. Good air quality year-round.',
        ],
      },
    ],
    tip: 'Best months for Ride Laos: December and January. Cool, dry, clear skies — perfect riding conditions across all routes. Book early — these months fill up fast.',
  },

  /* ───── 2. Riding Routes ───── */
  'rider-routes': {
    summary: "Laos offers some of the best motorcycle riding in Southeast Asia. These are the key routes — rated by difficulty, surface quality, and what makes them special for riders.",
    sections: [
      {
        title: '🗺️ Key Riding Routes',
        items: [
          'Route 13 North (Vientiane → Vang Vieng → Luang Prabang): The backbone of Lao motorcycle touring. 480km total. Spectacular karst limestone scenery north of Vang Vieng. Well-paved with mountain curves. Intermediate — manageable for most riders.',
          'Route 13 South (Vientiane → Thakhek → Savannakhet → Pakse): Flatter and more straightforward. Good roads. Excellent for beginners or high-mileage days.',
          'Thakhek Loop (Route 12 / Route 8 / Route 13): 450km circuit from Thakhek. Passes Kong Lor Cave and remote limestone karst. Mix of sealed and unsealed road. Intermediate.',
          'Bolaven Plateau Loop (Route 16 / Route 20 / Route 23): 300km circuit from Pakse. Waterfalls, coffee farms, and cool highland air. Mostly paved. Easy to moderate.',
          'Route 8 (Thakhek → Vietnam border / Na Phao): One of the most scenic roads in Laos. Jungle canyon riding. 120km fuel gap — plan carefully. Moderate.',
          'Route 3 North (Luang Prabang → Huay Xai / Boten): Remote northern Laos. Winding mountain roads with stunning scenery. Some unsealed sections. Advanced riders recommended.',
          'Route 6 (Phonsavanh / Plain of Jars): Rolling highlands and dramatic UXO history sites. Good roads. Interesting for history-focused riders.',
        ],
      },
      {
        title: '⚡ Road Difficulty Ratings',
        items: [
          'Easy: Fully paved roads in good condition. Any motorbike suitable. Examples: Route 13 South, Vientiane city, Vientiane–Vang Vieng section.',
          'Moderate: Mostly paved with some gravel or rough sections. Dual-sport recommended. Examples: Route 13 North (mountain section), Thakhek Loop sealed roads, Bolaven Plateau loop.',
          'Advanced: Significant unsealed sections, possible river crossings, steep gradients. Dual-sport required, off-road experience recommended. Examples: Route 8 remote sections, remote northern tracks, wet season conditions on any rural road.',
          'Route 13 Vang Vieng → Luang Prabang: The mountain section (approx. km 100–185 from Vang Vieng) is the most challenging part of the main northern route — narrow, winding, with sharp corners. Ride with patience.',
          'Wet season note: Any Moderate route can become Advanced in heavy rain. Mud, landslides, and flooded sections change road difficulty significantly.',
        ],
      },
      {
        title: '⛽ Fuel Gap Reference',
        items: [
          'Route 13 North: Maximum fuel gap approximately 60–80km between stations. No problems for most bikes.',
          'Thakhek Loop (outer road / Route 12): Up to 80–100km between fuel stops. Fill up at every opportunity.',
          'Route 8 (Thakhek toward Vietnam): Longest reliable fuel gap — up to 120km. Carry a 2L emergency fuel container. Non-negotiable on this route.',
          'Bolaven Plateau: Well-supplied. Maximum gap approximately 40–60km.',
          'Remote northern routes (Route 3, Route 6): Variable — some 100km+ gaps in mountain sections. Always ask locally before departing each town.',
          'Village fuel rule: In any village, look for a row of glass bottles filled with yellow/orange liquid at roadside stalls — this is petrol (typically RON 92). More expensive than stations but always available.',
          'CRF250L fuel range: approximately 220–250km per tank (8.7L). Plan refuels before the 150km mark to maintain a comfortable reserve.',
        ],
      },
      {
        title: '⚠️ Top Riding Hazards — Know Before You Ride',
        items: [
          '🥇 Gravel on paved corners: The number one crash cause for foreign riders in Laos. Mountain roads accumulate gravel and sand on the outside of corners — especially after rain or truck traffic. Enter every corner slower than you think you need to.',
          '🥈 Sand on road surface: Fine sand blown or washed across tarmac acts like ice. Particularly common in dry season on flat open roads and near riverbeds.',
          '🥉 Livestock on road: Buffalo and cattle — especially dangerous at dawn, dusk, and night. A buffalo weighs up to 800kg. Do not assume they will move. Reduce speed aggressively in rural areas.',
          'Unmarked speed bumps: Appear without warning in villages and on approaches to towns. Often invisible at speed. Constant vigilance required through any populated area.',
          'Trucks overtaking blind: On Route 13 mountain sections, trucks and buses overtake on blind corners. Ride well left and do not assume the road ahead is clear.',
          'Potholes at road edges: Even good-condition roads deteriorate sharply at the tarmac edge. Stay centered in your lane.',
          'Rain: Surface becomes very slippery in the first 10–15 minutes of rain before dust and oil wash away. Reduce speed significantly at the start of any rain event.',
        ],
      },
      {
        title: '📍 Navigation Strategy for Riders',
        items: [
          'GPS signal: Strong throughout Laos — even in remote mountain areas. GPS works reliably without mobile data.',
          'Google Maps: Good for cities and main routes. Directions sometimes unreliable on minor roads — use as backup.',
          'Organic Maps: Best free offline navigation for Laos. Download regional maps before departure. More detailed rural coverage than Google Maps.',
          'iOverlander: Essential for ADV riders. Community-sourced fuel stops, campsites, mechanics, and road condition reports. Invaluable in remote areas.',
          'Gaia GPS: Best for off-road track recording and topo mapping. Recommended for riders tackling remote northern routes.',
          'Maps.me: Good offline option with reasonable rural detail. Useful backup.',
          'Offline maps are mandatory: Mobile data signal disappears on most mountain routes. Download maps before leaving each town.',
        ],
      },
      {
        title: '🏨 Accommodation Strategy for Riders',
        items: [
          'Reservations: Generally not needed outside of peak season (Dec–Jan, Lao New Year in April). Show up and find a room in any town of 5,000+ people.',
          'Guesthouse price guide: Basic (fan room, shared bathroom) USD 8–15 / Mid-range (AC, ensuite) USD 20–40 / Boutique / upmarket USD 50–120.',
          'Bike security: Ask your guesthouse to store the bike in a courtyard or under cover overnight. Most are happy to accommodate this request.',
          'Remote areas: In very small villages on routes like Route 8 or northern Route 3, village homestays are sometimes the only option. Expect basic facilities — mattress on floor, communal bathroom, local food. A genuinely memorable experience.',
          'Riding-friendly towns: Vang Vieng, Phonsavanh, Thakhek, Pakse, and Pakbeng all have good rider infrastructure. Luang Prabang has the widest range but book ahead in peak season.',
          'Mechanic proximity: Try to end riding days in a town large enough to have a mechanic. Your guide or guesthouse owner can direct you to the nearest repair shop.',
        ],
      },
    ],
    tip: "The golden rule of riding in Laos: fill your tank whenever you see a petrol station, regardless of how much fuel you have. This habit alone will prevent 90% of fuel-related problems on remote routes.",
  },

  /* ───── 3. Money & Payment ───── */
  money: {
    summary: 'Laos uses the Lao Kip (LAK), but US Dollars and Thai Baht are widely accepted in tourist areas. QR payments are increasingly common even in rural areas — worth setting up before you arrive.',
    sections: [
      {
        title: '💵 Currency Basics',
        items: [
          'Official currency: Lao Kip (LAK). Banknotes: 1,000 / 2,000 / 5,000 / 10,000 / 20,000 / 50,000 / 100,000 Kip.',
          'Exchange rate (March 2026): approximately 21,000–21,500 LAK per USD 1 (official Lao PDR Bank rate). Street and exchange booth rates vary slightly. Check xe.com for the current rate before departure.',
          'USD: Widely accepted at guesthouses, tour operators, rental shops, and major tourist attractions. Change is given in Kip.',
          'Thai Baht (THB): Accepted in border towns (Vientiane, Thakhek) and southern Laos. 1 THB ≈ 600 LAK.',
          'Euros / GBP / AUD: Exchangeable in Vientiane and Luang Prabang. Bring USD as backup — it\'s the most universally accepted foreign currency.',
        ],
      },
      {
        title: '🏦 Currency Exchange',
        items: [
          'Best rates: Licensed exchange booths in city centres — particularly around Talat Sao market in Vientiane.',
          'Airport exchange: Available but rates are poor. Change just enough for a taxi on arrival.',
          'Hotels and guesthouses: Can exchange but rates are consistently bad. Emergency use only.',
          'Luang Prabang: Multiple exchange booths in the old town. Rates slightly lower than Vientiane but not significantly.',
          'Remote areas (Bolaven, Thakhek loop): Almost no exchange facilities. Exchange everything you need in Vientiane or Pakse before departure.',
          'Recommendation: Bring USD cash from home for the best overall flexibility. Exchange to Kip as needed for local markets and fuel.',
        ],
      },
      {
        title: '🏧 ATMs',
        items: [
          'Vientiane and Luang Prabang: Multiple ATMs available. BCEL and LDB are most reliable for foreign cards.',
          'Withdrawal limits by bank: BCEL — 2,000,000 LAK per transaction / LDB — 3,000,000 LAK / JDB — 5,000,000 LAK. Use JDB or LDB if available to reduce per-transaction fees.',
          'ATM fee: approximately 25,000 LAK per withdrawal (BCEL). Withdraw larger amounts less frequently.',
          'Daily limit: usually USD 300–500 depending on your home bank.',
          'Rural areas: Very few ATMs. Vang Vieng has 2–3. Thakhek has 1–2. Bolaven Plateau and remote mountain sections have none — withdraw everything you need in Vientiane or Pakse before heading out.',
          'Reliability: ATMs frequently run out of cash or malfunction. If one fails, try another bank.',
        ],
      },
      {
        title: '📱 QR Payments',
        items: [
          'LAO QR: Laos\' national QR payment system. Accepted at over 90% of shops, market stalls, petrol stations, and even rural roadside vendors.',
          'For visitors: The BCEL One app supports QR payments and can be linked to international cards. Worth setting up before arrival.',
          'Advantage for riders: No fumbling with thick wads of Kip notes. No counterfeit risk. No change disputes. Pay instantly at fuel stops.',
          'Backup always needed: Not all QR terminals work reliably in remote areas. Always carry Kip cash as backup.',
        ],
      },
      {
        title: '💳 Card Payments',
        items: [
          'Vientiane and Luang Prabang: Mid-range and upmarket hotels and restaurants accept Visa/Mastercard.',
          'Vang Vieng: Some resorts accept cards. Most local places are cash only.',
          'Rural areas: 100% cash. No exceptions.',
          'Petrol stations: Large brand stations (Shell, PetroTrade) sometimes accept cards but not reliably. Always carry Kip cash for fuel — this is non-negotiable for riders.',
          'Village fuel: Small roadside vendors (fuel in bottles or barrels) are cash only. These are your lifeline in remote areas where no formal station exists.',
          'Apple Pay / Google Pay: Not widely accepted. Rely on physical card or cash.',
        ],
      },
      {
        title: '💡 Daily Budget Guide',
        items: [
          'Accommodation: USD 10–30 (guesthouse to mid-range hotel). Included in Ride Laos tour pricing.',
          'Meals: USD 5–15/day (local restaurant USD 2–5 per meal, tourist restaurant USD 5–15).',
          'Drinks & snacks: USD 3–5/day (Beer Lao large bottle USD 1–2, coffee USD 1–2).',
          'Fuel: approximately USD 5–8/day (CRF250L at 150km/day).',
          'Attraction entry fees: typically 20,000–30,000 LAK (USD 1–1.50). Kuang Si Falls and major sites are higher.',
          'Personal spending outside tour costs: USD 20–40/day is comfortable for most travelers. Note: prices across Laos have risen 20–30% since 2023 due to inflation and Kip depreciation — budget conservatively.',
        ],
      },
    ],
    tip: 'Set up the BCEL One app before you arrive and link your international card. Being able to pay by QR — even at a remote village petrol stop — is a genuine quality-of-life upgrade for riders. SAFETY WARNING: Do not drink street cocktails or unlabelled spirits in Laos. Methanol poisoning from counterfeit alcohol is a real risk — several fatalities occurred in 2025. Stick to sealed bottles and Beer Lao.',
  },

  /* ───── 4. SIM & Internet ───── */
  telecom: {
    summary: 'Getting connected in Laos is easy and cheap. A local SIM card is the best option for data — coverage is surprisingly good on main roads.',
    sections: [
      {
        title: '📱 SIM Cards',
        items: [
          'Best providers for travelers: Unitel and Lao Telecom (LTC). Both offer tourist SIM packages.',
          'Where to buy: Airport arrivals hall (Wattay, Luang Prabang), convenience stores, and phone shops in any town. Cost: 20,000–50,000 LAK for SIM + starter data.',
          'Data packages: 1GB for approximately 15,000 LAK. Monthly unlimited packages from 80,000–150,000 LAK. Very affordable.',
          'Registration: Passport required for SIM registration. Takes 5–10 minutes at the shop.',
          'Top-up: Available at convenience stores and phone shops everywhere. Look for \'Top Up\' or provider logos.',
          'eSIM: Available for Laos through providers like Airalo and Holafly — convenient option if you want data before arrival.',
        ],
      },
      {
        title: '📶 Coverage',
        items: [
          '4G coverage: Excellent in Vientiane, Luang Prabang, Vang Vieng, Pakse, and major towns.',
          'Route 13 (Vientiane–Luang Prabang): Generally good coverage with some dead zones in mountain sections.',
          'Remote routes (Thakhek Loop, Bolaven Plateau): Patchy coverage. Download offline maps before departure.',
          'Northern highlands: Coverage can be limited. Unitel tends to have better rural coverage than LTC.',
          'No coverage: Deep jungle, some highland sections, and inside caves (Kong Lor). Plan accordingly.',
        ],
      },
      {
        title: '🗺️ Essential Apps for Riders',
        items: [
          'Maps.me, Organic Maps, or OsmAnd: Best offline navigation apps for Laos. Download maps before leaving areas with connectivity. GPS signal is strong throughout Laos — even remote mountain areas have good GPS. Mobile data is the variable — not GPS.',
          'Google Maps: Works well in cities and on main roads. Less reliable on remote tracks.',
          'iOverlander: Community-sourced travel info including fuel stops, road conditions, and accommodation.',
          'XE Currency: For quick currency conversion.',
          'Grab: Available in Vientiane for city transport.',
        ],
      },
      {
        title: '☎️ Calling & Communication',
        items: [
          'Local calls: Very cheap with a local SIM. International calls via WhatsApp or similar over data.',
          'WhatsApp: Widely used in Laos — the primary way locals and businesses communicate with international visitors.',
          'Emergency numbers: Tourist Police 1192 (English-speaking, recommended for foreigners), Ambulance 1195 or 1623, Fire 1190. Save all of these before your ride.',
          'Ride Laos emergency contact: Always save your guide\'s local number before heading out on any route.',
        ],
      },
    ],
    tip: 'Rider tip: Download offline maps for your entire route the night before departure. Don\'t rely on live data in remote areas — connectivity disappears without warning.',
  },

  /* ───── 5. Bike Maintenance ───── */
  bike: {
    summary: "Ride Laos operates Honda CRF250L and CRF300L dual-sport motorcycles — well-suited to Laos road conditions. Here's everything you need to know about the bikes, maintenance, and what to do if something goes wrong.",
    sections: [
      {
        title: '🏍️ The Bikes',
        items: [
          'Honda CRF250L: Primary tour bike. 249cc single-cylinder. Lightweight (146kg), fuel-efficient, and highly reliable. Ideal for mixed road conditions. Seat height: 875mm.',
          'Honda CRF300L: Available for taller riders or those preferring more power. 286cc. Slightly heavier but more torque on climbs. Seat height: 895mm.',
          'Why CRF: Parts availability across Laos and Thailand. Honda dealer network in Vientiane and major towns. Proven reliability on Lao roads over thousands of touring kilometres.',
          'Bike condition: All Ride Laos bikes are serviced before each tour. Oil, chain, tyres, and brake pads checked. Any mechanical issues identified during pre-tour inspection are resolved before departure.',
          'Tyre type: Dual-sport tyres fitted as standard. Suitable for paved roads and light off-road tracks. Not optimised for deep mud or technical off-road.',
        ],
      },
      {
        title: '⚙️ Pre-Ride Checks',
        items: [
          'Engine oil: Check level via sight glass before each day\'s riding. Top up if below minimum.',
          'Tyre pressure: Front 29 psi / Rear 33 psi (laden). Check cold — before riding. Correct pressure significantly affects handling and tyre life.',
          'Chain tension and lubrication: Check slack (20–25mm mid-point) and lubricate every 300–500km or after riding in rain.',
          'Brake levers: Both front and rear brakes should feel firm. Report any sponginess to your guide immediately.',
          'Lights: Check headlight, brake light, and indicators before each morning departure.',
          'Fuel: Check level before departing — never assume. Fill up whenever a station is available on remote routes.',
        ],
      },
      {
        title: '🔧 Roadside Repairs & Support',
        items: [
          'Puncture repair (\'Pin\' shops): Found in virtually every village in Laos. Look for a hand-painted tyre sign or a collection of wheels outside a roadside shop. Cost: 20,000–50,000 LAK. Fast and reliable.',
          'Chain replacement: Available at Honda dealers in major cities. Parts usually in stock for CRF models.',
          'Oil change: Available everywhere. Honda Genuine Oil or equivalent grade used.',
          'Ride Laos emergency support: 24-hour phone line. Support vehicle and spare bikes can be dispatched to your location (tour participants only).',
          'Bike insurance: Basic cover included in tour price. Rider liability limits for damage apply — details provided at briefing.',
          'Spare tube protocol: On long remote routes, spare inner tubes (front and rear) plus tyre levers are carried in the support vehicle.',
          'If you get a puncture: Do NOT ride on a flat — you will destroy the tube and potentially the wheel. Stop immediately and contact your guide.',
        ],
      },
      {
        title: '⚠️ Riding Safety Rules',
        items: [
          'Helmet: Always worn. Full-face helmet provided by Ride Laos or use your own.',
          'Protective gear: Knee and elbow pads provided. Riding gloves mandatory.',
          'Off-road technique: Standing position required on rough sections. Guide demonstrates correct technique at pre-departure briefing.',
          'No riding under the influence: Zero tolerance. Riding after heavy drinking the previous night is also strongly discouraged.',
          'Fatigue management: 15-minute rest every 2 hours of riding. Stop immediately if feeling drowsy — fatigue is a leading cause of motorcycle accidents.',
          'Group riding: Maintain 3–5 second gap to the rider ahead. Signal guide before overtaking.',
        ],
      },
      {
        title: '🛠️ What Riders Should Know',
        items: [
          'Gear shifting: CRF250L/300L uses standard 1-down, 5-up pattern. Neutral between 1st and 2nd.',
          'Engine braking: Use engine braking on descents — reduces brake fade on long mountain downhills.',
          'Fuel reserve: Switch to reserve when main tank runs low. Reserve gives approximately 20–30km additional range. Fill up before switching back.',
          'Stalling on hills: If the bike stalls on a steep climb, do not panic. Apply front brake, restart engine, and use clutch control to move off smoothly.',
          'Wet roads: Reduce speed, increase following distance, and avoid sudden braking or acceleration. Painted road markings and metal drain covers are extremely slippery when wet.',
          'Sand and gravel: Relax your grip, look ahead, and maintain steady throttle. Do not brake suddenly on loose surfaces.',
        ],
      },
    ],
    tip: "If you get a flat tyre, stop immediately. Riding on a flat destroys the tube and can damage the wheel rim. Flag down your guide or call the support line — we'll get you to the nearest repair shop ('Pin' shop) within minutes.",
  },

  /* ───── 6. Roads & Fuel ───── */
  riding: {
    summary: "Riding in Laos is genuinely rewarding — light traffic, spectacular scenery, and roads that reward a measured pace. Understanding local road conditions and traffic patterns is essential for a safe ride.",
    sections: [
      {
        title: '🛣️ Road Conditions',
        items: [
          'Main highways (Route 13, Route 9): Paved and generally good condition. Suitable for all bikes.',
          'National routes: Paved but expect potholes, rough patches, and occasional road works — especially after wet season.',
          'Provincial and rural tracks: Unpaved. Quality varies enormously — from good gravel to deep rutted mud. Dual-sport or off-road capable bikes recommended.',
          'Road markings: Minimal outside of Vientiane. Lane discipline is loose — ride defensively.',
          'Speed bumps: Common in villages and on the approaches to towns. Often unmarked. Stay alert.',
          'Potholes: Can appear suddenly on otherwise good roads. Especially common on the edges of the tarmac.',
        ],
      },
      {
        title: '⛽ Fuel Availability',
        items: [
          'Petrol stations: Available in all towns and along main routes. Shell, PTT, and independent stations.',
          'Fuel type: RON 92 and RON 95 petrol widely available. Diesel at most stations.',
          'Remote routes: Fuel gaps of 60–100km are possible on the Thakhek Loop and northern routes. Always fill up when you see a station.',
          'Village fuel: Small villages often sell fuel from roadside bottles or drums — usually RON 92. Higher price but available in emergencies.',
          'Fuel cost: Approximately 12,000–15,000 LAK per litre (roughly USD 0.60–0.75).',
          'Carry a spare fuel container on remote routes — a 2L emergency supply can save the day.',
        ],
      },
      {
        title: '🚗 Traffic & Riding Safety',
        items: [
          'Traffic drives on the right in Laos.',
          'Traffic density: Light outside of Vientiane. City riding is manageable but requires alertness.',
          'Overtaking: Common and sometimes aggressive — especially trucks and buses on Route 13. Give large vehicles plenty of space.',
          'Livestock: Cattle, buffalo, dogs, and chickens on roads are normal — especially at dawn and dusk in rural areas. Reduce speed.',
          'Night riding: Strongly discouraged. Unlit vehicles, livestock, and potholes make night riding very dangerous. Plan to arrive at your destination before dark.',
          'Helmet: Full-face helmet strongly recommended. Local law requires helmets — enforcement varies but safety is the priority.',
        ],
      },
      {
        title: '🏍️ Expressway & Restrictions',
        items: [
          'Vientiane–Vang Vieng Expressway: Motorcycles are now legally permitted on this expressway (policy changed). However, Ride Laos always rides Route 13 — the expressway is fast but featureless. Route 13\'s mountain curves, village stops, and karst scenery are the actual point of riding in Laos.',
          'Some urban roads in Vientiane have motorcycle lane restrictions — follow local signage.',
          'International driving license: Required for riding in Laos. An IDP (International Driving Permit) alongside your home license is recommended.',
          'Police checkpoints: Occasional on main routes. Have your license and passport available. Say Sabaidee, smile, and be patient — most interactions are brief.',
          '🚫 UXO warning: Never ride off established roads near Xieng Khouang Province (Plain of Jars) or the Vietnamese border. Unexploded bombs from the Secret War remain buried. Stay on marked roads in these regions at all times.',
        ],
      },
    ],
    tip: 'Ride Laos rule: Never ride after dark. Even on familiar roads, the combination of unlit vehicles, livestock, and unexpected hazards makes night riding a serious risk. We always plan our routes to arrive before sunset.',
  },

  /* ───── 7. Medical & Safety ───── */
  medical: {
    summary: "Medical facilities in Laos are limited outside of Vientiane. Good preparation and comprehensive travel insurance with medical evacuation cover are essential for any serious riding trip.",
    sections: [
      {
        title: '🏥 Medical Facilities',
        items: [
          'Vientiane: Mahosot Hospital and Setthathirath Hospital are the main public hospitals. Vientiane International Medical Center (VIMC) is the best option for foreigners — English-speaking staff, reasonable standards.',
          'Luang Prabang: Provincial hospital with limited facilities. Adequate for minor injuries.',
          'Vang Vieng: Small clinic available. Serious cases are transferred to Vientiane (3–4 hour drive).',
          'Rural areas: Village health posts with very basic facilities. Any serious injury will require evacuation.',
          'Thailand (Bangkok, Udon Thani, Nong Khai): Many serious cases are evacuated to Thailand — only 1–2 hours from Vientiane. Bumrungrad and Bangkok Hospital are world-class.',
        ],
      },
      {
        title: '💉 Vaccinations & Health Prep',
        items: [
          'Recommended vaccinations: Hepatitis A, Hepatitis B, Typhoid, Tetanus. Consult your travel doctor 4–6 weeks before departure.',
          'Malaria: Risk is low in most tourist areas but present in rural and forested regions. Consult a doctor about prophylaxis for remote routes.',
          'Dengue fever: Present throughout Laos, including urban areas. No vaccine widely available — use insect repellent (DEET-based).',
          'Rabies: Risk from dog and bat bites. Pre-exposure vaccination recommended for extended stays or remote riding.',
          'Water: Do not drink tap water. Bottled water is cheap and widely available — approximately 3,000 LAK per 1.5L.',
        ],
      },
      {
        title: '🧰 First Aid & Medications',
        items: [
          'Bring a personal first aid kit: wound dressings, antiseptic, pain relief, anti-diarrhea medication, oral rehydration salts, and any personal prescriptions.',
          'Pharmacies: Available in all towns. Basic medications widely stocked. English spoken at larger pharmacies in Vientiane.',
          'Prescription medications: Bring sufficient supply from home — your specific brand may not be available.',
          'Heat exhaustion: A real risk in hot months. Stay hydrated, take breaks in shade, and carry electrolyte tablets.',
          'Road rash: The most common motorcycle injury. Keep wounds clean and covered — infection risk is higher in tropical climates.',
        ],
      },
      {
        title: '🆘 Emergency & Evacuation',
        items: [
          'Travel insurance with medical evacuation cover is MANDATORY for any Ride Laos tour. Non-negotiable.',
          'Recommended insurers: World Nomads, SafetyWing, Battleface — all offer motorcycle-specific adventure coverage.',
          'Emergency numbers (2026): Tourist Police 1192 (English-speaking — best first call for foreigners), Ambulance 1195 or 1623, Fire 1190.',
          'Ambulance response reality: In Vientiane, response is 15–30 minutes. Outside Vientiane, expect 30–90 minutes or longer. In truly remote areas, no ambulance service exists. Your guide and support vehicle are your first responders — this is why the Ride Laos support system exists.',
          'Medical evacuation: In serious cases, evacuation to Thailand is the standard procedure. A quality insurance policy will cover this.',
          'Ride Laos emergency protocol: All guides carry first aid kits and emergency contact numbers. Support vehicle is always on call.',
        ],
      },
    ],
    tip: 'Do not skimp on travel insurance. Medical evacuation from rural Laos to Bangkok can cost USD 5,000–15,000 without coverage. A good policy costs USD 50–100 for a 2-week trip. It\'s the most important gear you\'ll pack.',
  },

  /* ───── 8. Food & Dining ───── */
  food: {
    summary: "Lao food is delicious, fresh, and underrated. Sticky rice is the staple, and the cuisine shares influences with Thai and Vietnamese cooking but has its own distinct character. Eating well in Laos is easy and very affordable.",
    sections: [
      {
        title: '🍚 Lao Food Essentials',
        items: [
          'Sticky rice (Khao Niao): The heart of every Lao meal. Eaten with your hands, rolled into balls and dipped in sauces or curries.',
          'Laap (Larb): Minced meat salad with herbs, lime, and toasted rice powder. The national dish — try the pork or duck version.',
          'Or Lam: Rich stew with vegetables, herbs, and meat. A Luang Prabang specialty.',
          'Tam Mak Hoong: Lao-style green papaya salad. Spicier and more complex than the Thai version.',
          'Khao Piak Sen: Lao rice noodle soup — the go-to breakfast dish. Fresh, light, and comforting.',
          'Ping Gai: Lao-style grilled chicken marinated in lemongrass and garlic. Found at roadside stalls everywhere.',
        ],
      },
      {
        title: '🍺 Drinks',
        items: [
          'Beer Lao: The national beer. Genuinely excellent lager. Available everywhere. A large bottle costs 15,000–20,000 LAK.',
          'Lao-Lao: Traditional rice whisky. Strong, cheap, and ubiquitous at local celebrations. Try it — just carefully.',
          'Coffee: Laos grows some of the finest coffee in Southeast Asia, particularly on the Bolaven Plateau. Lao iced coffee (café nom yen) is a revelation.',
          'Fresh fruit juices: Available at markets and roadside stalls. Mango, watermelon, and sugarcane juice are excellent.',
          'Water: Always bottled. 3,000 LAK per 1.5L. Stay well hydrated — especially on full riding days.',
        ],
      },
      {
        title: '🍽️ Where to Eat',
        items: [
          'Local markets: The best and cheapest food in Laos. Morning markets (talat sao) are open from 06:00–10:00. Evening markets have cooked food stalls.',
          'Roadside restaurants (haan kin khao): Simple rice-and-dish restaurants found in every town. Point at whatever looks good — works every time.',
          'Tourist restaurants: Available in Vientiane, Luang Prabang, and Vang Vieng. Western food, pizza, burgers — all available if you need a break from Lao food.',
          'Riding breaks: Look for haan kin khao with motorbikes parked outside — a reliable indicator of good local food.',
          'Hygiene: Stick to freshly cooked food and busy stalls with high turnover. Avoid pre-prepared food sitting in the sun.',
        ],
      },
      {
        title: '⚠️ Food Safety for Riders',
        items: [
          'Ice: In cities and tourist areas, ice is generally safe (commercially produced). In remote villages, avoid ice in drinks.',
          'Raw vegetables: Wash risk in rural areas — stick to cooked vegetables or peel your own fruit.',
          'Street cocktails and unlabelled spirits: AVOID. Methanol poisoning from counterfeit alcohol caused several fatalities in Laos in 2025. Stick to Beer Lao and sealed bottles only.',
          'Stomach issues: Mild digestive upset is common in the first few days. Carry oral rehydration salts and anti-diarrhea medication.',
          'Allergies: Inform your guide of any serious food allergies before the tour. Nut and shellfish allergies require vigilance at local restaurants.',
        ],
      },
    ],
    tip: 'Bolaven Plateau coffee is world-class — grown at altitude with rich volcanic soil. Buy a bag from a farm directly on the plateau loop. Cheaper than any specialty café and genuinely excellent. One of the best souvenirs from any Ride Laos tour.',
  },

  /* ───── 9. History & Culture ───── */
  history: {
    summary: "Laos has a rich and complex history — from ancient Khmer influence to the powerful Lan Xang Kingdom, French colonialism, and the devastating Secret War. Understanding this history makes every ride more meaningful.",
    sections: [
      {
        title: '👑 Ancient History & The Lan Xang Kingdom',
        items: [
          'Laos is home to some of Southeast Asia\'s most ancient civilizations. The Plain of Jars in Xieng Khouang dates back over 2,000 years — its purpose still debated by archaeologists.',
          'The Lan Xang Kingdom (\'Kingdom of a Million Elephants\') was founded in 1353 by Fa Ngum. At its peak, it was one of the largest kingdoms in Southeast Asia, encompassing much of modern Laos and parts of Thailand and China.',
          'Luang Prabang served as the royal capital. Its magnificent temples, including Wat Xieng Thong (1559), are remarkably well-preserved and represent the pinnacle of Lao Buddhist architecture.',
          'Wat Phu, near Champasak in southern Laos, is a pre-Angkorian Khmer temple complex dating to the 5th century — older than Angkor Wat and equally atmospheric.',
          'The kingdom fragmented in the 18th century into three separate kingdoms: Luang Prabang, Vientiane, and Champasak.',
        ],
      },
      {
        title: '🇫🇷 French Colonial Period (1893–1953)',
        items: [
          'France colonized Laos in 1893 as part of French Indochina, alongside Vietnam and Cambodia.',
          'The French left a lasting architectural legacy — most visibly in Vientiane\'s wide boulevards, colonial shophouses, and the Patuxai victory monument (built post-independence but in French style).',
          'Lao baguettes (khao ji pate): Perhaps the most delicious colonial legacy. The French baguette tradition is alive and thriving across Laos.',
          'Luang Prabang\'s UNESCO World Heritage status reflects the unique blend of traditional Lao architecture and French colonial influence that defines the city\'s streetscape.',
          'Laos gained independence from France on 19 July 1949, with full sovereignty declared in 1953.',
        ],
      },
      {
        title: '✈️ The Secret War & Modern Laos',
        items: [
          'During the Vietnam War (1964–1973), Laos was subjected to the most intensive aerial bombing campaign in history. The US dropped over 2 million tonnes of bombs — more than all bombs dropped in World War II combined.',
          'Up to 30% of the bombs dropped did not explode. These unexploded ordnance (UXO) continue to kill and injure Lao people today — Laos remains the most heavily bombed country per capita in the world.',
          'The COPE Center in Vientiane and the UXO Lao Visitor Centre in Luang Prabang tell this story powerfully. A visit is strongly recommended.',
          'The Pathet Lao, a communist movement supported by North Vietnam, took power in 1975 and established the Lao People\'s Democratic Republic — the government that rules today.',
          'Modern Laos has opened significantly to tourism since the 1990s. The country balances one-party communist governance with a growing market economy and a thriving tourism sector.',
        ],
      },
    ],
    tip: 'Rider recommendation: Visit the COPE Center in Vientiane (free entry, donations welcome). The exhibition on the Secret War bombing and UXO clearance efforts is one of the most moving experiences in Southeast Asia. It will change how you see the landscape you\'re riding through.',
  },

  /* ───── 10. Lao Language ───── */
  language: {
    summary: "Lao belongs to the same language family as Thai — similar in structure and script. English is spoken in tourist areas and cities, but in the countryside, Lao is your only option. A handful of phrases goes a very long way.",
    sections: [
      {
        title: '👋 Essential Greetings',
        items: [
          'Hello / How are you?: ສະບາຍດີ — Sabaidee. The universal Lao greeting. Use it constantly — with shopkeepers, villagers, petrol station staff. Always met with a smile.',
          'Thank you: ຂອບໃຈ — Khob jai.',
          'Thank you very much: ຂອບໃຈຫຼາຍໆ — Khob jai lai lai.',
          'No problem / You\'re welcome / Never mind: ບໍ່ເປັນຫຍັງ — Bor pen nyang. Possibly the most useful phrase in Laos — covers almost any awkward situation.',
          'Good luck / Goodbye: ໂຊກດີ — Sok dee. Literally means \'good luck\' — used as a warm farewell.',
          'Yes: ແມ່ນ — Maen. / No: ບໍ່ — Bor.',
          'Sorry / Excuse me: ຂໍໂທດ — Kho thot.',
        ],
      },
      {
        title: '⛽ Petrol Station & Breakdown Phrases',
        items: [
          'Petrol station: ປັ໊ມນ້ຳມັນ — Pam nam man. (Look for the sign — you\'ll see this constantly on the road.)',
          'Fill it up please: ເຕັມ — Tem. (Hold up your petrol cap and say this — universally understood.)',
          'Flat tyre: ຢາງແບນ — Yang baen.',
          'Repair shop: ຮ້ານສ້ອມ — Han som.',
          'The motorcycle is broken: ລົດເພ — Lot pe.',
          'Please help me: ຊ່ວຍແດ່ — Suay dae.',
          'Where is...?: ຢູ່ໃສ — Yuu sai? (Point and ask — works for petrol stations, hospitals, guesthouses.)',
        ],
      },
      {
        title: '🍽️ Food & Restaurant Phrases',
        items: [
          'Delicious!: ແຊບ — Saep! (The highest compliment you can pay to a Lao cook — say it enthusiastically.)',
          'Not spicy please: ບໍ່ເຜັດ — Bor phet.',
          'A little spicy: ເຜັດໜ້ອຍ — Phet noi.',
          'Sticky rice: ເຂົ້າໜຽວ — Khao niao. (The Lao staple — eaten with almost everything.)',
          'Water: ນ້ຳ — Nam. / Beer: ເບຍ — Bia.',
          'The bill please: ເກັບເງິນ — Gep ngern.',
          'How much?: ເທົ່າໃດ — Tao dai?',
          'Too expensive: ແພງ — Phaeng. / Can you reduce it?: ລົດແດ່ — Lot dae.',
        ],
      },
      {
        title: '🆘 Emergency Phrases',
        items: [
          'Help!: ຊ່ວຍແດ່! — Suay dae! (Loud and urgent — anyone nearby will understand.)',
          'Hospital: ໂຮງໝໍ — Hong mo.',
          'Police: ຕຳຫຼວດ — Tam luat.',
          'I am injured / I am sick: ເຈັບ — Jep.',
          'Danger!: ອັນຕະລາຍ — An ta lai.',
          'I am lost: ຫຼົງທາງ — Long thang.',
          'Please contact the nearest embassy: ຕິດຕໍ່ສະຖານທູດ — Tit to sa than thut. (Your guide will have embassy numbers — always save these before heading out.)',
        ],
      },
      {
        title: '🔢 Numbers — Essential for Prices & Distances',
        items: [
          '1–5: ໜຶ່ງ (Nung) / ສອງ (Song) / ສາມ (Sam) / ສີ່ (Si) / ຫ້າ (Ha)',
          '6–10: ຫົກ (Hok) / ເຈັດ (Jet) / ແປດ (Paet) / ເກົ້າ (Kao) / ສິບ (Sip)',
          '20: ຊາວ (Sao) / 100: ຮ້ອຍ (Hoi) / 1,000: ພັນ (Phan)',
          '10,000: ໝື່ນ (Muen) / 100,000: ແສນ (Saen) / 1,000,000: ລ້ານ (Lan)',
          'Practical example: 50,000 Kip (a common price) = Ha muen (ຫ້າໝື່ນ). Hold up fingers if unsure.',
          'Tip: Lao people will usually write the price down or show you on a calculator — don\'t stress about perfect pronunciation.',
        ],
      },
    ],
    tip: '\'Sabaidee\' and \'Khob jai\' — learn these two before you arrive. You\'ll use them dozens of times a day. Cultural note: the traditional Lao greeting is the \'Nop\' — press your palms together at chest height and bow slightly while saying Sabaidee. Lao people love when visitors use this. Never touch someone\'s head (considered sacred) and never point your feet at a person or Buddha image (considered disrespectful). Your Ride Laos guide will explain local customs as you go.',
  },

  /* ───── 11. Visa & Entry ───── */
  visa: {
    summary: 'Most Western passport holders can enter Laos easily — either visa-free, via e-Visa, or Visa on Arrival. Here\'s everything you need to know before you arrive.',
    sections: [
      {
        title: '🛂 Visa Options for Western Travelers',
        items: [
          'Visa on Arrival (VOA): Available at major international borders including Vientiane (Wattay Airport), Savannakhet, and Thakhek. Cost: USD 30–50 depending on nationality (rates have increased — bring USD 50 to be safe).',
          'e-Visa: Apply online at laoevisa.gov.la before departure. USD 35 + USD 10 processing fee. Processing time: typically 3–5 business days — allow up to 1 week during peak seasons (Dec–Jan, April). Recommended for hassle-free entry.',
          'Visa-free entry: Citizens of several ASEAN countries and some others may enter visa-free. Check your country\'s specific agreement.',
          'Most EU, UK, US, Canadian, and Australian passport holders require a visa — VOA or e-Visa are both straightforward options.',
          'Standard stay: 30 days from entry date.',
        ],
      },
      {
        title: '✈️ Getting to Laos',
        items: [
          'Main international airport: Wattay International Airport, Vientiane (VTE). Regional hub with connections via Bangkok (BKK/DMK), Singapore (SIN), Kuala Lumpur (KUL), and Hanoi (HAN).',
          'Budget airlines: AirAsia, Lao Airlines, Bangkok Airways, and Vietnam Airlines all serve Vientiane.',
          'Overland entry: Common crossing points from Thailand — Nong Khai/Vientiane Friendship Bridge, Nakhon Phanom/Thakhek, and Mukdahan/Savannakhet.',
          'From Cambodia/Vietnam: Several border crossings available. Check current opening status before travel.',
          'Average flight time from Europe: 12–16 hours with one stopover (Bangkok or Singapore most common).',
        ],
      },
      {
        title: '🛃 Entry Requirements',
        items: [
          'Digital entry form (LDIF): Laos introduced a digital immigration system in late 2025. Register online at www.immigration.gov.la within 72 hours before arrival to receive a QR code. Major entry points (Wattay Airport, Luang Prabang Airport, Pakse Airport, Friendship Bridge 1) use this system. Without it, processing may be delayed.',
          'Passport valid for at least 6 months beyond your intended stay.',
          'Passport-size photos (2 copies) still required for Visa on Arrival at some border points — bring from home.',
          'IMPORTANT — crisp banknotes only: Lao border officials and exchange booths refuse worn, torn, or heavily marked USD bills. Bring new, clean USD 100 bills specifically. Old or damaged notes will be rejected.',
          'Proof of onward travel may be requested (return or onward flight ticket).',
          'Yellow fever vaccination certificate required if arriving from an endemic country.',
          'Sufficient funds: USD 500 equivalent sometimes requested, rarely enforced.',
        ],
      },
      {
        title: '🔄 Visa Extension & Overstay',
        items: [
          '30-day visa can be extended once at the Department of Immigration in Vientiane. Cost: approximately USD 2 per day, up to 30 additional days.',
          'Overstay fine: USD 10 per day. Paid at the border on exit — straightforward process.',
          'Visa runs: Thailand border crossings are used for visa renewal, but same-day re-entry is increasingly refused at major crossings including Nong Khai and Mukdahan — plan at least one overnight in Thailand to avoid being turned away. Not relevant for Ride Laos tour participants (tours are designed within standard visa durations).',
          'Long-stay options: Laos does not currently offer a digital nomad or long-term tourist visa. Multiple entry visas are available for business travelers.',
          'Always check the latest regulations at the Lao Embassy or laoevisa.gov.la before your trip — rules can change.',
        ],
      },
    ],
    tip: 'Pro tip from Ride Laos: Apply for your e-Visa 1 week before departure. It\'s USD 10 more than VOA but saves you time in the queue — especially useful after a long-haul flight.',
  },

  /* ───── 12. Packing List ───── */
  packing: {
    summary: "Motorcycle touring demands smart packing — safety gear and weather protection are non-negotiable, but everything else should be minimal. Ride Laos provides helmets and basic protective gear. Here's what to bring.",
    sections: [
      {
        title: '🪖 Riding Gear (Provided by Ride Laos)',
        items: [
          'Helmet: Full-face helmet provided. You may use your own — check Bluetooth intercom compatibility if you use one.',
          'Knee and elbow protectors: Provided as standard.',
          'Riding gloves: Basic gloves provided. Personal gloves recommended if you prefer specific fit or protection level.',
          'Side bags: Fitted to CRF250L/300L as standard. Waterproof inner liner included.',
          'Rain gear: Basic rain suit provided. Personal Gore-Tex jacket preferred if you have one.',
          'Bring yourself: Riding jacket, riding boots, and personal gloves for optimal comfort and protection.',
        ],
      },
      {
        title: '👕 Clothing',
        items: [
          'Riding jacket: Wind and waterproof with removable mesh inner layer is most versatile for Laos conditions.',
          '🚫 E-cigarettes / Vapes: STRICTLY PROHIBITED in Laos. Import, possession, and use are illegal. Confiscation at the airport is standard — fines and detention are possible. Do not bring them under any circumstances.',
          'Riding trousers: Integrated knee armour recommended. Standard long trousers are acceptable for easier routes.',
          'Riding boots: Ankle protection is essential. Waterproof preferred. Minimum: ankle-height hiking boots.',
          'Casual clothes: For evenings and sightseeing — 2–3 t-shirts, 1–2 pairs of long trousers.',
          'Light fleece or jacket: Essential for Bolaven Plateau and Luang Prabang. Useful on morning rides across all routes.',
          'Swimwear: Multiple swimming opportunities — Blue Lagoons, Kuang Si Falls, riverside stops.',
          'Quick-dry towel: Highly recommended. Dries fast and packs small — some remote guesthouses don\'t provide towels.',
          'Buff or neck gaiter: Versatile — sun protection, dust mask, and cold morning neck warmer in one item.',
        ],
      },
      {
        title: '🎒 Essential Documents & Valuables',
        items: [
          'Passport + 2 photocopies: Keep original in a waterproof pouch. Store copies separately.',
          'International Driving Permit (IDP): Must be obtained in your home country before departure. Required for legal riding in Laos.',
          'Travel insurance certificate: Printed copy plus digital backup on your phone.',
          'Cash: USD 200–300 plus a card enabled for overseas ATM withdrawals (verify this before you leave home).',
          'Smartphone + charger + power bank (20,000mAh+ recommended).',
          'Waterproof phone case: Essential for riding — protects from rain and dust while keeping the touchscreen usable.',
          'Sunglasses (UV400): Non-negotiable. Protects against wind, dust, and intense tropical sun.',
          'Earplugs: For long riding days — wind noise at speed causes genuine hearing fatigue over hours.',
        ],
      },
      {
        title: '💊 Medical & Personal',
        items: [
          'Personal medications: Digestive (anti-diarrhea, antacid), fever/pain relief, antihistamine, cold/flu tablets.',
          'Wound care: Assorted plasters (including large ones), antiseptic solution, antibiotic ointment, gauze and tape.',
          'Essentials: DEET insect repellent (30%+), sunscreen SPF50+, lip balm with SPF.',
          'Personal hygiene: Toothbrush/paste, razor, shampoo/soap — remote guesthouses may not provide these.',
          'Wet wipes and hand sanitizer: Invaluable at rural restaurants and after dusty off-road sections.',
        ],
      },
      {
        title: '📱 Electronics',
        items: [
          'Action camera (GoPro or similar): Helmet mount for riding footage — one of the best souvenirs from any tour.',
          'Main camera: For landscape photography. Weatherproof/dustproof models are a significant advantage.',
          'SD cards: Bring plenty — 64GB minimum, more if shooting video. Video fills cards faster than expected.',
          'Multi-port charger: USB-C and USB-A ports. Laos uses 220V — standard European/Australian plugs work directly. US/UK travelers need an adapter.',
          'Backup power bank: 20,000mAh+. Remote guesthouses sometimes have unstable electricity.',
          'Bluetooth intercom (optional): For communication with guide and group while riding. Not required — guides use hand signals effectively.',
        ],
      },
      {
        title: '📦 Packing Tips',
        items: [
          'Backpacks on your back while riding put strain on shoulders and back over long days. Use the provided side bags and a tank bag instead.',
          'Waterproof everything: Pack all clothing and electronics in dry bags or zip-lock bags — even in dry season, dust gets into everything.',
          'Balance the side bags: Equal weight left and right. Heavy items at the bottom. Imbalanced bags affect handling.',
          'Accessibility: Keep frequently needed items (water, sunscreen, snacks, camera) in the tank bag — not buried in side bags.',
          'Leave space: Budget room for purchases — Bolaven Plateau coffee, Luang Prabang textiles, and local handicrafts are tempting.',
          'Total weight target: Keep combined side bag weight under 10kg. Heavy luggage noticeably affects bike handling on mountain roads.',
        ],
      },
    ],
    tip: "Pack light — if you're asking 'might I need this?', leave it behind. Almost everything you might need is available in Laos. The three non-negotiables: passport, International Driving Permit, and travel insurance certificate.",
  },
}
