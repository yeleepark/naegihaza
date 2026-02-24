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
  return translations[locale] || translations.ko;
}

export function getMetadata(locale: Locale) {
  return {
    home: {
      title: locale === 'ko' ? '내기하자 – 룰렛 · 사다리타기 · 주사위 · 복권 무료 랜덤 게임' :
        locale === 'en' ? 'Naegihaza - Let\'s Bet | Random Games with Friends' :
          locale === 'zh' ? 'Naegihaza - 打赌吧 | 与朋友一起玩随机游戏' :
            'Naegihaza - ¡Apostemos! | Juegos Aleatorios con Amigos',
      description: locale === 'ko' ? '내기하자에서 친구들과 빠르게 결정하세요. 룰렛, 사다리타기, 주사위, 복권 긁기, 폭탄 뽑기를 한 번에 사용할 수 있는 무료 랜덤 선택 도구입니다.' :
        locale === 'en' ? 'Let\'s bet! Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets.' :
          locale === 'zh' ? '打赌吧！与朋友一起享受的免费在线打赌游戏平台。使用随机轮盘和掷骰子公平地决定顺序和打赌。' :
            '¡Apostemos! Plataforma de juegos de apuestas en línea gratuita para disfrutar con amigos. Usa la ruleta aleatoria y lanzamiento de dados para decidir el orden de manera justa.',
      keywords: locale === 'ko' ? ['내기하자', '내기하자 사이트', '내기하자 게임', '랜덤 게임', '랜덤 선택기', '랜덤 추첨기', '룰렛 돌리기', '사다리타기', '주사위 굴리기', '복권 긁기', '벌칙 정하기', '제비뽑기', '당번 뽑기', '이름 추첨기', '팀 나누기', '메뉴 정하기', '누가 계산', '술게임 정하기', '파티 게임', '무료 랜덤 선택 사이트'] :
        locale === 'en' ? ['random game', 'random selector', 'random picker', 'spin roulette', 'ladder game', 'roll dice', 'penalty picker', 'draw lots', 'duty picker', 'name picker', 'team split', 'menu picker', 'who pays', 'drinking game picker', 'party game', 'friends game', 'choice paralysis solver', 'online random tool', 'free random pick site', 'random decision tool'] :
        locale === 'zh' ? ['随机游戏', '随机选择器', '随机抽奖', '转盘', '梯子游戏', '掷骰子', '惩罚选择', '抽签', '当值抽选', '名字抽选', '分队', '选菜单', '谁请客', '酒局选择', '派对游戏', '朋友游戏', '选择困难解决', '在线随机工具', '免费随机选择网站', '随机决定工具'] :
        ['juego aleatorio', 'selector aleatorio', 'sorteo aleatorio', 'ruleta', 'juego escalera', 'dados', 'elegir castigo', 'sorteo', 'sorteo turno', 'sorteo nombres', 'dividir equipos', 'elegir menú', 'quién paga', 'juego bebida', 'juego fiesta', 'juego amigos', 'resolver indecisión', 'herramienta aleatoria online', 'sitio gratis sorteo', 'herramienta decisión aleatoria'],
    },
    dice: {
      title: locale === 'ko' ? '내기하자 주사위 – 온라인 주사위 굴리기 랜덤 게임' :
        locale === 'en' ? 'Dice Roll | Naegihaza' :
          locale === 'zh' ? '掷骰子 | Naegihaza' :
            'Lanzar Dados | Naegihaza',
      description: locale === 'ko' ? '내기하자 주사위로 빠르게 결과를 확인하세요. 게임, 내기, 순서 정하기 등 다양한 상황에서 사용할 수 있는 무료 온라인 주사위 도구입니다.' :
        locale === 'en' ? 'Roll the dice and compete for the highest score! A fair dice game to enjoy with friends. Roll 2 dice and the person with the highest total wins.' :
          locale === 'zh' ? '掷骰子，争夺最高分！与朋友一起享受的公平骰子游戏。掷2个骰子，总分最高的人获胜。' :
            '¡Lanza los dados y compite por la puntuación más alta! Un juego de dados justo para disfrutar con amigos. Lanza 2 dados y la persona con el total más alto gana.',
      keywords: locale === 'ko' ? ['내기하자 주사위', '주사위 굴리기 사이트', '랜덤 숫자 생성기', '순서 정하기', '온라인 주사위'] :
        locale === 'en' ? ['dice roll site', 'random number generator', 'order picker', 'online dice'] :
          locale === 'zh' ? ['掷骰子网站', '随机数生成器', '顺序选择', '在线骰子'] :
            ['sitio dados', 'generador números aleatorios', 'orden', 'dados online'],
    },
    roulette: {
      title: locale === 'ko' ? '내기하자 룰렛 – 이름 추첨 · 당번 · 내기 정하기 온라인' :
        locale === 'en' ? 'Random Roulette | Naegihaza' :
          locale === 'zh' ? '随机轮盘 | Naegihaza' :
            'Ruleta Aleatoria | Naegihaza',
      description: locale === 'ko' ? '내기하자 룰렛에서 이름을 입력하고 돌려 한 명을 선택하세요. 누가 계산할지, 당번 정하기, 벌칙 정하기에 사용할 수 있는 무료 랜덤 선택 도구입니다.' :
        locale === 'en' ? 'Nobody knows who will be chosen! Spin the wheel of fate. Use this fair random roulette game with friends to decide order or make bets.' :
          locale === 'zh' ? '谁都不知道会选中谁！转动命运之轮。与朋友一起使用这个公平的随机轮盘游戏来决定顺序或打赌。' :
            '¡Nadie sabe quién será elegido! Gira la rueda del destino. Usa este juego de ruleta aleatoria justo con amigos para decidir el orden o hacer apuestas.',
      keywords: locale === 'ko' ? ['내기하자 룰렛', '룰렛 돌리기 사이트', '이름 추첨기', '당번 뽑기', '누가 계산', '랜덤 선택기'] :
        locale === 'en' ? ['roulette site', 'name picker', 'duty picker', 'who pays', 'random selector'] :
          locale === 'zh' ? ['转盘网站', '抽名字', '抽当值', '谁请客', '随机选择器'] :
            ['sitio ruleta', 'sorteo nombres', 'sorteo turno', 'quién paga', 'selector aleatorio'],
    },
    ladder: {
      title: locale === 'ko' ? '내기하자 사다리타기 – 랜덤 추첨 · 제비뽑기 온라인' :
        locale === 'en' ? 'Ladder Game | Naegihaza' :
          locale === 'zh' ? '爬梯游戏 | Naegihaza' :
            'Juego de Escalera | Naegihaza',
      description: locale === 'ko' ? '내기하자 사다리타기에서 참가자와 결과를 입력하면 즉시 결과를 확인할 수 있습니다. 당첨, 벌칙, 점심 메뉴 정하기에 사용하는 무료 사다리타기 도구입니다.' :
        locale === 'en' ? 'Who gets what? Climb the ladder and let fate decide! A fair ladder game to enjoy with friends.' :
          locale === 'zh' ? '谁会得到什么结果？爬梯决定命运！与朋友一起享受的公平爬梯游戏。' :
            '¿Quién obtendrá qué resultado? ¡Sube la escalera y que el destino decida! Un juego de escalera justo para disfrutar con amigos.',
      keywords: locale === 'ko' ? ['내기하자 사다리타기', '사다리타기 사이트', '제비뽑기', '랜덤 추첨', '벌칙 정하기', '점심 메뉴 정하기'] :
        locale === 'en' ? ['ladder game site', 'draw lots', 'random draw', 'penalty picker', 'lunch picker'] :
          locale === 'zh' ? ['梯子游戏网站', '抽签', '随机抽奖', '惩罚选择', '午餐选择'] :
            ['sitio juego escalera', 'sorteo', 'sorteo aleatorio', 'elegir castigo', 'elegir almuerzo'],
    },
    bomb: {
      title: locale === 'ko' ? '내기하자 폭탄 뽑기 – 벌칙 정하기 랜덤 선택 게임' :
        locale === 'en' ? 'Bomb Draw | Naegihaza' :
          locale === 'zh' ? '炸弹抽取 | Naegihaza' :
            'Bomba | Naegihaza',
      description: locale === 'ko' ? '내기하자 폭탄 뽑기로 카드를 선택해 벌칙 당첨자를 정하세요. 친구, 파티, 술자리에서 사용하는 간단한 벌칙 선택 게임입니다.' :
        locale === 'en' ? 'Draw the bomb card and take the penalty! A thrilling bomb draw game to enjoy with friends.' :
          locale === 'zh' ? '抽到炸弹牌就接受惩罚！与朋友一起享受的紧张刺激炸弹抽取游戏。' :
            '¡Saca la carta bomba y acepta el castigo! Un emocionante juego de bomba para disfrutar con amigos.',
      keywords: locale === 'ko' ? ['내기하자 폭탄뽑기', '벌칙 정하기', '술게임 벌칙', '벌칙 뽑기', '랜덤 벌칙 선택'] :
        locale === 'en' ? ['penalty picker', 'drinking game penalty', 'penalty draw', 'random penalty pick'] :
          locale === 'zh' ? ['惩罚选择', '酒局惩罚', '抽惩罚', '随机惩罚选择'] :
            ['elegir castigo', 'castigo juego bebida', 'sorteo castigo', 'castigo aleatorio'],
    },
    scratch: {
      title: locale === 'ko' ? '내기하자 복권 긁기 – 당첨자 뽑기 스크래치 게임' :
        locale === 'en' ? 'Scratch Lottery | Naegihaza' :
          locale === 'zh' ? '刮刮乐 | Naegihaza' :
            'Rasca y Gana | Naegihaza',
      description: locale === 'ko' ? '내기하자 복권 긁기에서 참가자 수만큼 복권이 생기고 당첨자 수만큼 당첨 복권이 있어요. 긁어서 당첨 여부를 확인하세요!' :
        locale === 'en' ? 'Each participant gets a scratch lottery ticket. Scratch to reveal if you won!' :
          locale === 'zh' ? '每位参与者获得一张刮刮乐彩票，刮开即可查看是否中奖！' :
            '¡Cada participante recibe un boleto rasca y gana. Rasca para saber si ganaste!',
      keywords: locale === 'ko' ? ['내기하자 복권', '복권 긁기', '스크래치 복권', '당첨자 뽑기', '랜덤 당첨', '제비뽑기'] :
        locale === 'en' ? ['scratch lottery', 'scratch card game', 'winner picker', 'random winner', 'lottery game'] :
          locale === 'zh' ? ['刮刮乐', '刮彩票', '抽奖', '随机中奖', '彩票游戏'] :
            ['rasca y gana', 'lotería rasca', 'elegir ganador', 'ganador aleatorio', 'juego lotería'],
    },
  };
}
