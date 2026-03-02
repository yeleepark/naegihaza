import type { Locale } from './settings';
import ko from './locales/ko.json';
import en from './locales/en.json';
import zh from './locales/zh.json';
import es from './locales/es.json';

const translations = {
  ko,
  en,
  zh,
  es,
};

export function getTranslations(locale: Locale) {
  return translations[locale] || translations.en;
}

export function getMetadata(locale: Locale) {
  return {
    home: {
      title: locale === 'ko' ? '랜덤게임.zip – 룰렛돌리기 · 랜덤 뽑기 · 랜덤 추첨기 무료 게임' :
        locale === 'en' ? 'RandomGame.zip | Random Games with Friends' :
          locale === 'zh' ? 'RandomGame.zip | 与朋友一起玩随机游戏' :
            'RandomGame.zip | Juegos Aleatorios con Amigos',
      description: locale === 'ko' ? '랜덤게임.zip에서 친구들과 빠르게 결정하세요. 룰렛돌리기, 랜덤 뽑기, 슬롯머신, 벽돌깨기를 한 번에 사용할 수 있는 무료 랜덤 추첨기입니다.' :
        locale === 'en' ? 'Free online random game platform to enjoy with friends. Use roulette, slot machine, and breakout to fairly decide with fun.' :
          locale === 'zh' ? '与朋友一起享受的免费在线随机游戏平台。使用轮盘、老虎机和打砖块来公平有趣地做决定。' :
            'Plataforma de juegos aleatorios en línea gratuita para disfrutar con amigos. Usa la ruleta, tragamonedas y breakout para decidir de manera justa y divertida.',
      keywords: locale === 'ko' ? ['랜덤게임.zip', '랜덤게임zip', '랜덤 추첨기', '랜덤 뽑기', '룰렛돌리기', '랜덤 게임', '랜덤 선택기', '무료 랜덤 추첨', '온라인 추첨기', '이름 추첨기', '랜덤 돌림판', '벌칙 정하기', '제비뽑기', '당번 뽑기', '팀 나누기', '메뉴 정하기', '누가 계산', '술게임 정하기', '파티 게임', '무료 랜덤 선택 사이트', '랜덤 뽑기 사이트', '온라인 룰렛'] :
        locale === 'en' ? ['random game', 'random selector', 'random picker', 'spin roulette', 'roll dice', 'penalty picker', 'draw lots', 'duty picker', 'name picker', 'team split', 'menu picker', 'who pays', 'drinking game picker', 'party game', 'friends game', 'online random tool', 'free random pick site', 'random decision tool'] :
        locale === 'zh' ? ['随机游戏', '随机选择器', '随机抽奖', '转盘', '掷骰子', '惩罚选择', '抽签', '当值抽选', '名字抽选', '分队', '选菜单', '谁请客', '酒局选择', '派对游戏', '在线随机工具', '免费随机选择网站', '随机决定工具'] :
        ['juego aleatorio', 'selector aleatorio', 'sorteo aleatorio', 'ruleta', 'dados', 'elegir castigo', 'sorteo', 'sorteo turno', 'sorteo nombres', 'dividir equipos', 'elegir menú', 'quién paga', 'juego fiesta', 'herramienta aleatoria online', 'sitio gratis sorteo', 'herramienta decisión aleatoria'],
    },
    roulette: {
      title: locale === 'ko' ? '룰렛돌리기 – 랜덤 뽑기 · 이름 추첨 · 당번 정하기' :
        locale === 'en' ? 'Random Roulette – Spin the Wheel' :
          locale === 'zh' ? '随机轮盘 – 转盘抽选' :
            'Ruleta Aleatoria – Gira la Rueda',
      description: locale === 'ko' ? '룰렛돌리기에서 이름을 입력하고 돌려 한 명을 선택하세요. 누가 계산할지, 당번 정하기, 벌칙 정하기에 사용할 수 있는 무료 랜덤 추첨기입니다.' :
        locale === 'en' ? 'Nobody knows who will be chosen! Spin the wheel of fate. Use this fair random roulette game with friends to decide order or make bets.' :
          locale === 'zh' ? '谁都不知道会选中谁！转动命运之轮。与朋友一起使用这个公平的随机轮盘游戏来决定顺序。' :
            '¡Nadie sabe quién será elegido! Gira la rueda del destino. Usa este juego de ruleta aleatoria justo con amigos para decidir el orden.',
      keywords: locale === 'ko' ? ['룰렛돌리기', '룰렛 돌리기 사이트', '랜덤 뽑기', '랜덤 추첨기', '이름 추첨기', '당번 뽑기', '누가 계산', '랜덤 선택기', '온라인 룰렛', '랜덤 돌림판', '랜덤 룰렛', '랜덤 추첨', '랜덤 게임', '내기 게임', '벌칙 뽑기', '제비뽑기', '파티 게임', '술자리 게임', '순서 정하기'] :
        locale === 'en' ? ['roulette site', 'name picker', 'duty picker', 'who pays', 'random selector', 'random roulette', 'random draw', 'random game', 'betting game', 'penalty picker', 'party game', 'drinking game', 'decision maker'] :
          locale === 'zh' ? ['转盘网站', '抽名字', '抽当值', '谁请客', '随机选择器', '随机轮盘', '随机抽奖', '随机游戏', '打赌游戏', '派对游戏', '酒局游戏', '决定工具'] :
            ['sitio ruleta', 'sorteo nombres', 'sorteo turno', 'quién paga', 'selector aleatorio', 'ruleta aleatoria', 'sorteo aleatorio', 'juego aleatorio', 'juego apuestas', 'juego fiesta', 'juego bebidas', 'herramienta decisión'],
    },
    breakout: {
      title: locale === 'ko' ? '벽돌깨기 – 마지막 블럭 당첨 랜덤 뽑기 게임' :
        locale === 'en' ? 'Breakout – Last Block Wins' :
          locale === 'zh' ? '打砖块 – 最后砖块获胜' :
            'Breakout – El Último Bloque Gana',
      description: locale === 'ko' ? '벽돌깨기에서 블럭을 깨고 마지막까지 남은 블럭이 당첨자! 랜덤 추첨을 게임으로 즐기세요.' :
        locale === 'en' ? 'Break the blocks! The last block standing wins. A fun breakout game to decide winners with friends.' :
          locale === 'zh' ? '打碎砖块！最后剩下的砖块获胜。与朋友一起玩的有趣打砖块决定游戏。' :
            '¡Rompe los bloques! El último bloque en pie gana. Un divertido juego de breakout para decidir ganadores con amigos.',
      keywords: locale === 'ko' ? ['벽돌깨기 게임', '블럭깨기', '랜덤 당첨', '랜덤 뽑기 게임', '랜덤 추첨 게임', '랜덤 룰렛', '랜덤 뽑기', '랜덤 추첨', '랜덤 게임', '내기 게임', '벌칙 뽑기', '파티 게임', '술자리 게임'] :
        locale === 'en' ? ['breakout game', 'block breaker', 'brick breaker', 'random winner', 'party game', 'random draw', 'random game', 'betting game', 'penalty picker', 'drinking game', 'decision maker'] :
          locale === 'zh' ? ['打砖块', '消除方块', '随机中奖', '派对游戏', '随机抽奖', '随机游戏', '打赌游戏', '酒局游戏', '决定工具'] :
            ['breakout', 'rompe bloques', 'ganador aleatorio', 'juego fiesta', 'sorteo aleatorio', 'juego aleatorio', 'juego apuestas', 'juego bebidas', 'herramienta decisión'],
    },
    slot: {
      title: locale === 'ko' ? '슬롯머신 – 릴 돌리기 랜덤 추첨 게임' :
        locale === 'en' ? 'Slot Machine – Spin the Reels' :
          locale === 'zh' ? '老虎机 – 转轮抽选' :
            'Tragamonedas – Gira los Carretes',
      description: locale === 'ko' ? '슬롯머신에서 3개의 릴을 돌려 당첨자를 선정하세요. 릴이 하나씩 멈추며 긴장감 넘치는 랜덤 뽑기 게임입니다.' :
        locale === 'en' ? 'Spin the reels and find the winner! A fun slot machine game to select someone randomly with friends.' :
          locale === 'zh' ? '转动转轮找出赢家！与朋友一起玩的有趣老虎机随机选人游戏。' :
            '¡Gira los carretes y encuentra al ganador! Un divertido juego de tragamonedas para seleccionar a alguien al azar con amigos.',
      keywords: locale === 'ko' ? ['슬롯머신 게임', '릴 돌리기', '랜덤 당첨', '랜덤 뽑기 게임', '랜덤 추첨 게임', '랜덤 룰렛', '랜덤 뽑기', '랜덤 추첨', '랜덤 게임', '내기 게임', '벌칙 뽑기', '파티 게임', '술자리 게임'] :
        locale === 'en' ? ['slot machine game', 'spin reels', 'random winner', 'party game', 'random draw', 'random game', 'betting game', 'penalty picker', 'drinking game', 'decision maker'] :
          locale === 'zh' ? ['老虎机游戏', '转轮', '随机中奖', '派对游戏', '随机抽奖', '随机游戏', '打赌游戏', '酒局游戏', '决定工具'] :
            ['tragamonedas', 'girar carretes', 'ganador aleatorio', 'juego fiesta', 'sorteo aleatorio', 'juego aleatorio', 'juego apuestas', 'juego bebidas', 'herramienta decisión'],
    },
    bomb: {
      title: locale === 'ko' ? '폭탄돌리기 – 폭탄 터지면 당첨 랜덤 뽑기 게임' :
        locale === 'en' ? 'Bomb Pass – Pass the Bomb Game' :
          locale === 'zh' ? '传炸弹 – 炸弹传递随机选人游戏' :
            'Pasa la Bomba – Juego de Pasar la Bomba',
      description: locale === 'ko' ? '폭탄돌리기에서 폭탄이 참가자 사이를 돌다가 터지면 당첨! 숨겨진 타이머로 극한의 긴장감을 느껴보세요.' :
        locale === 'en' ? 'Pass the bomb between players — whoever holds it when it explodes is selected! A hidden timer creates maximum suspense.' :
          locale === 'zh' ? '炸弹在参与者之间传递，爆炸时持有者被选中！隐藏计时器制造极致紧张感。' :
            '¡Pasa la bomba entre jugadores — quien la tenga cuando explote es el elegido! Un temporizador oculto crea el máximo suspenso.',
      keywords: locale === 'ko' ? ['폭탄돌리기', '폭탄 게임', '랜덤 당첨', '랜덤 뽑기 게임', '파티 게임', '랜덤 룰렛', '랜덤 뽑기', '랜덤 추첨', '랜덤 게임', '내기 게임', '벌칙 뽑기', '술자리 게임', '폭탄 돌리기 게임'] :
        locale === 'en' ? ['bomb pass game', 'pass the bomb', 'random winner', 'party game', 'bomb game', 'random draw', 'random game', 'betting game', 'penalty picker', 'drinking game', 'decision maker'] :
          locale === 'zh' ? ['传炸弹游戏', '炸弹传递', '随机中奖', '派对游戏', '随机抽奖', '随机游戏', '打赌游戏', '酒局游戏', '决定工具'] :
            ['pasa la bomba', 'juego bomba', 'ganador aleatorio', 'juego fiesta', 'sorteo aleatorio', 'juego aleatorio', 'juego apuestas', 'juego bebidas', 'herramienta decisión'],
    },
    horse: {
      title: locale === 'ko' ? '경마게임 – 전체 순위 결정 랜덤 레이스 게임' :
        locale === 'en' ? 'Horse Race – Random Ranking Race Game' :
          locale === 'zh' ? '赛马游戏 – 随机排名赛跑游戏' :
            'Carrera de Caballos – Juego de Carrera con Ranking',
      description: locale === 'ko' ? '경마게임에서 참가자들이 말을 타고 레이스를 펼칩니다. 랜덤 속도 변화로 역전과 추월이 반복되어 전체 순위가 결정되는 랜덤 게임입니다.' :
        locale === 'en' ? 'Watch participants race on horseback! Random speed changes create overtakes and comebacks. A fun random race game that ranks all players.' :
          locale === 'zh' ? '参与者骑马比赛！随机速度变化带来超越和逆转。为所有玩家排名的有趣随机赛跑游戏。' :
            '¡Los participantes compiten a caballo! Los cambios aleatorios de velocidad crean adelantamientos y remontadas. Un divertido juego de carrera que clasifica a todos.',
      keywords: locale === 'ko' ? ['경마게임', '순위 정하기', '랜덤 레이스', '랜덤 순위', '랜덤 게임', '랜덤 뽑기', '파티 게임', '순서 정하기', '내기 게임'] :
        locale === 'en' ? ['horse race game', 'ranking game', 'random race', 'random ranking', 'party game', 'order picker', 'betting game'] :
          locale === 'zh' ? ['赛马游戏', '排名游戏', '随机赛跑', '随机排名', '派对游戏', '顺序选择', '打赌游戏'] :
            ['carrera de caballos', 'juego de ranking', 'carrera aleatoria', 'ranking aleatorio', 'juego fiesta', 'orden aleatorio', 'juego apuestas'],
    },
    mine: {
      title: locale === 'ko' ? '지뢰찾기 – 지뢰를 피하라! 벌칙 뽑기 게임' :
        locale === 'en' ? 'Minesweeper – Find the Mine Random Game' :
          locale === 'zh' ? '扫雷 – 踩地雷随机选人游戏' :
            'Buscaminas – Juego Aleatorio de Minas',
      description: locale === 'ko' ? '지뢰찾기에서 5×5 그리드의 숨겨진 지뢰를 피하세요! 참가자가 직접 칸을 선택하고 지뢰를 밟으면 벌칙! 스릴 넘치는 랜덤 게임입니다.' :
        locale === 'en' ? 'One mine hides in a 5×5 grid! Take turns choosing tiles — step on the mine and you\'re out. A thrilling random penalty game with friends.' :
          locale === 'zh' ? '5×5网格中隐藏着1个地雷！轮流选择格子——踩到地雷就要接受惩罚。与朋友一起玩的刺激随机游戏。' :
            '¡Una mina se esconde en una cuadrícula 5×5! Elige casillas por turnos — pisa la mina y pagas la penitencia. Un emocionante juego aleatorio.',
      keywords: locale === 'ko' ? ['지뢰찾기', '지뢰찾기 게임', '랜덤 뽑기', '랜덤 게임', '파티 게임', '내기 게임', '랜덤 추첨', '벌칙 뽑기'] :
        locale === 'en' ? ['minesweeper', 'mine game', 'random picker', 'party game', 'random game', 'selection game', 'pick one game'] :
          locale === 'zh' ? ['扫雷', '地雷游戏', '随机选择', '派对游戏', '随机游戏', '选人游戏'] :
            ['buscaminas', 'juego de minas', 'selector aleatorio', 'juego fiesta', 'juego aleatorio', 'juego selección'],
    },
    privacy: {
      title: locale === 'ko' ? '개인정보처리방침' :
        locale === 'en' ? 'Privacy Policy' :
          locale === 'zh' ? '隐私政策' :
            'Política de Privacidad',
      description: locale === 'ko' ? '랜덤게임.zip의 개인정보처리방침입니다. 개인정보 수집, 쿠키 사용, 데이터 저장에 대한 정책을 안내합니다.' :
        locale === 'en' ? 'RandomGame.zip privacy policy. Learn about our data collection, cookie usage, and data storage practices.' :
          locale === 'zh' ? 'RandomGame.zip的隐私政策。了解我们的数据收集、Cookie使用和数据存储做法。' :
            'Política de privacidad de RandomGame.zip. Conozca nuestras prácticas de recopilación de datos, uso de cookies y almacenamiento.',
    },
    terms: {
      title: locale === 'ko' ? '이용약관' :
        locale === 'en' ? 'Terms of Service' :
          locale === 'zh' ? '服务条款' :
            'Términos de Servicio',
      description: locale === 'ko' ? '랜덤게임.zip의 이용약관입니다. 서비스 이용 조건과 이용자 책임에 대해 안내합니다.' :
        locale === 'en' ? 'RandomGame.zip terms of service. Learn about our service conditions and user responsibilities.' :
          locale === 'zh' ? 'RandomGame.zip的服务条款。了解我们的服务条件和用户责任。' :
            'Términos de servicio de RandomGame.zip. Conozca nuestras condiciones de servicio y responsabilidades del usuario.',
    },
  };
}
