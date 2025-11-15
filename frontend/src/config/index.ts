/**
 * CHAMPION TOGETHER Configuration
 *
 * Fork this repository and customize these settings to create your own fighter support DAO!
 * All text, content, and fighter information can be configured here.
 */

import type { AppConfig } from "./types";

export const config: AppConfig = {
  // ==================== Site Configuration ====================
  site: {
    siteName: "CHAMPION TOGETHER",
    daoName: "TEAM KENTA DAO",
    siteDescription:
      "ONE を目指すファイターを、コミュニティで継続的に支える後援会DAOです。",
  },

  // ==================== Fighter Information ====================
  fighter: {
    name: "KENTA TAKAHASHI",
    weightClass: "Bantamweight",
    gym: "STRONG Gym",
    organizer: "後援会 TEAM ARENA",
    imageUrl: undefined, // Set your fighter's image URL here
    bio: "ONE を目指すファイターを、コミュニティで継続的に支える後援会DAOです。",
  },

  // ==================== Home Page ====================
  homePage: {
    hero: {
      catchphrase:
        "ONE を目指すファイターを、コミュニティで継続的に支える後援会DAOです。",
      ctaButtonText: "今すぐ Support する",
      ctaSubtext: "USDC で支援 / Web3 ウォレット対応",
    },
    trust: {
      description:
        "支援はすべてスマートコントラクトで管理され、「分配頻度・上限額・分配率」はオンチェーンで誰でも確認できます。選手・ジム・後援会、全員にとってフェアな仕組みです。",
      learnMoreButtonText: "仕組みを詳しく見る",
    },
  },

  // ==================== Support Page ====================
  supportPage: {
    title: "サポートして、KENTAの挑戦を支える",
    description:
      "USDC で支援すると、資金は DAO プールに蓄積され、スマートコントラクトによって選手・ジム・幹事に自動分配されます。",
    successMessage: "Members NFT があなたのウォレットにミントされました。",
    errorMessage:
      "トランザクションに失敗しました。ウォレットの状態を確認して、もう一度お試しください。",
    dao: {
      description:
        "ONE 参戦を目指すバンタム級ファイター KENTA を支えるコミュニティプールです。",
    },
  },

  // ==================== Exclusive Content ====================
  exclusiveContent: {
    title: "TEAM KENTA メンバー限定コンテンツ",
    description:
      "Members NFT の保有枚数に応じて、ここだけのコンテンツにアクセスできます。Gold メンバー（NFT 10枚以上）は、動画やチケット割引コードもアンロックされます。",
    contentItems: [
      {
        id: "1",
        title: "試合当日のロッカールーム映像",
        description: "ONE 本戦前のロッカールームでの準備をメンバーだけに公開。",
        type: "video",
        requiredNft: 10,
        content: "https://example.com/video1.mp4",
      },
      {
        id: "2",
        title: "KENTAからの月1ボイスメッセージ",
        description: "近況報告と次の試合への意気込み。",
        type: "text",
        requiredNft: 5,
        content:
          "皆さん、いつも応援ありがとうございます！\n\n今月は新しいトレーニングメニューを取り入れて、パンチの切れ味を上げることに集中しています。次の試合では必ず勝利を掴み取ります。\n\nこれからも応援よろしくお願いします！\n\nKENTA",
      },
      {
        id: "3",
        title: "観戦チケット 10%OFF コード",
        description: "次回イベントのチケット割引コード。先着順。",
        type: "code",
        requiredNft: 1,
        content: "TEAMKENTA10",
      },
      {
        id: "4",
        title: "試合前日のミット打ち動画",
        description: "試合前日の調整スパーをノーカットでお届けします。",
        type: "video",
        requiredNft: 5,
        content: "https://example.com/video2.mp4",
      },
      {
        id: "5",
        title: "Gold メンバー限定トークセッション",
        description: "月1回の質問コーナー。KENTAが直接答えます。",
        type: "audio",
        requiredNft: 10,
        content: "audio_session_01.mp3",
      },
      {
        id: "6",
        title: "オフィシャルグッズ 20%OFF コード",
        description: "TEAM KENTA オフィシャルグッズの割引コード。",
        type: "code",
        requiredNft: 5,
        content: "TEAMGOODS20",
      },
    ],
    footer: {
      description:
        "Members NFT は、Support するたびに 1 枚ずつ増えていきます。NFT の枚数に応じて、見られるコンテンツや特典が増えていきます。",
      ctaButtonText: "Supportして NFT を増やす",
    },
  },

  // ==================== My Page ====================
  myPage: {
    title: "マイサポート",
    description:
      "あなたが TEAM KENTA をどれだけ支えてきたかを確認できます。支援のたびに Members NFT が増え、ランクが上がります。",
    walletNotConnectedMessage: "このページを見るにはウォレット接続が必要です",
    supportHistory: {
      title: "サポート履歴",
    },
    footer: {
      message: "あなたのサポートが、KENTAの次の一勝をつくります。",
      ctaButtonText: "もう一度 Support する",
    },
  },

  // ==================== Admin Page ====================
  adminPage: {
    distributionSettings: {
      title: "分配設定",
      updateSuccessMessage: "分配ルールを更新しました。",
      updateErrorMessage: "更新に失敗しました。",
    },
    distributionExecution: {
      title: "分配実行",
      executeSuccessMessage: "分配が完了しました。",
      executeErrorMessage: "分配に失敗しました。条件を確認してください。",
      bonusSuccessMessage: "勝利ボーナス {amount} USDC を分配しました。",
      bonusErrorMessage: "勝利ボーナスの分配に失敗しました。",
    },
    eventHistory: {
      title: "イベント履歴",
    },
  },

  // ==================== Rank Configuration ====================
  // Ranks are based on total support amount (matches smart contract logic)
  ranks: {
    bronze: {
      label: "Bronze Member",
      icon: "🥉",
      minAmount: 10, // 10 USDC
    },
    silver: {
      label: "Silver Member",
      icon: "⭐",
      minAmount: 50, // 50 USDC
    },
    gold: {
      label: "Gold Member",
      icon: "👑",
      minAmount: 100, // 100 USDC
    },
    platinum: {
      label: "Platinum Member",
      icon: "💎",
      minAmount: 200, // 200 USDC
    },
  },
};

// Export individual sections for convenience
export const siteConfig = config.site;
export const fighterInfo = config.fighter;
export const homePageConfig = config.homePage;
export const supportPageConfig = config.supportPage;
export const exclusiveContentConfig = config.exclusiveContent;
export const myPageConfig = config.myPage;
export const adminPageConfig = config.adminPage;
export const rankConfig = config.ranks;

// Export types
export type * from "./types";
