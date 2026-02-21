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
  const t = getTranslations(locale);

  const baseUrl = 'https://naegihaza.com';

  return {
    home: {
      title: locale === 'ko' ? 'Naegihaza - 내기하자 | 친구들과 즐기는 랜덤 게임' :
             locale === 'en' ? 'Naegihaza - Let\'s Bet | Random Games with Friends' :
             locale === 'zh' ? 'Naegihaza - 打赌吧 | 与朋友一起玩随机游戏' :
             'Naegihaza - ¡Apostemos! | Juegos Aleatorios con Amigos',
      description: locale === 'ko' ? '내기하자! 친구들과 함께 즐기는 무료 온라인 내기 게임 플랫폼. 랜덤 룰렛과 주사위 굴리기로 공정하게 순서를 정하고 내기를 해보세요.' :
                   locale === 'en' ? 'Let\'s bet! Free online betting game platform to enjoy with friends. Use random roulette and dice rolling to fairly decide order and make bets.' :
                   locale === 'zh' ? '打赌吧！与朋友一起享受的免费在线打赌游戏平台。使用随机轮盘和掷骰子公平地决定顺序和打赌。' :
                   '¡Apostemos! Plataforma de juegos de apuestas en línea gratuita para disfrutar con amigos. Usa la ruleta aleatoria y lanzamiento de dados para decidir el orden de manera justa.',
    },
    dice: {
      title: locale === 'ko' ? '주사위 굴리기 | Naegihaza' :
             locale === 'en' ? 'Dice Roll | Naegihaza' :
             locale === 'zh' ? '掷骰子 | Naegihaza' :
             'Lanzar Dados | Naegihaza',
      description: locale === 'ko' ? '주사위를 던져 최고 점수를 겨뤄보세요! 친구들과 함께 즐기는 공정한 주사위 게임. 2개의 주사위를 굴려 합계가 가장 높은 사람이 승리합니다.' :
                   locale === 'en' ? 'Roll the dice and compete for the highest score! A fair dice game to enjoy with friends. Roll 2 dice and the person with the highest total wins.' :
                   locale === 'zh' ? '掷骰子，争夺最高分！与朋友一起享受的公平骰子游戏。掷2个骰子，总分最高的人获胜。' :
                   '¡Lanza los dados y compite por la puntuación más alta! Un juego de dados justo para disfrutar con amigos. Lanza 2 dados y la persona con el total más alto gana.',
    },
    roulette: {
      title: locale === 'ko' ? '랜덤 룰렛 | Naegihaza' :
             locale === 'en' ? 'Random Roulette | Naegihaza' :
             locale === 'zh' ? '随机轮盘 | Naegihaza' :
             'Ruleta Aleatoria | Naegihaza',
      description: locale === 'ko' ? '누가 걸릴지 아무도 모른다! 운명의 룰렛을 돌려보세요. 친구들과 함께 즐기는 공정한 랜덤 룰렛 게임으로 순서를 정하거나 내기를 해보세요.' :
                   locale === 'en' ? 'Nobody knows who will be chosen! Spin the wheel of fate. Use this fair random roulette game with friends to decide order or make bets.' :
                   locale === 'zh' ? '谁都不知道会选中谁！转动命运之轮。与朋友一起使用这个公平的随机轮盘游戏来决定顺序或打赌。' :
                   '¡Nadie sabe quién será elegido! Gira la rueda del destino. Usa este juego de ruleta aleatoria justo con amigos para decidir el orden o hacer apuestas.',
    },
    ladder: {
      title: locale === 'ko' ? '사다리타기 | Naegihaza' :
             locale === 'en' ? 'Ladder Game | Naegihaza' :
             locale === 'zh' ? '爬梯游戏 | Naegihaza' :
             'Juego de Escalera | Naegihaza',
      description: locale === 'ko' ? '누가 어떤 결과에 걸릴지 몰라! 사다리를 타고 운명을 결정하세요. 친구들과 함께 즐기는 공정한 사다리타기 게임.' :
                   locale === 'en' ? 'Who gets what? Climb the ladder and let fate decide! A fair ladder game to enjoy with friends.' :
                   locale === 'zh' ? '谁会得到什么结果？爬梯决定命运！与朋友一起享受的公平爬梯游戏。' :
                   '¿Quién obtendrá qué resultado? ¡Sube la escalera y que el destino decida! Un juego de escalera justo para disfrutar con amigos.',
    },
  };
}
