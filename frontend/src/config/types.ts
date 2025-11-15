/**
 * Configuration Types for CHAMPION TOGETHER
 *
 * Fork this project and customize these settings to create your own fighter support DAO!
 */

// ==================== Site Configuration ====================

export interface SiteConfig {
  /** Site name displayed in header */
  siteName: string;
  /** DAO name (e.g., "TEAM KENTA DAO") */
  daoName: string;
  /** Site description for SEO */
  siteDescription: string;
}

// ==================== Fighter Information ====================

export interface FighterInfo {
  /** Fighter's full name (e.g., "KENTA TAKAHASHI") */
  name: string;
  /** Weight class (e.g., "Bantamweight", "Lightweight") */
  weightClass: string;
  /** Gym affiliation (e.g., "STRONG Gym") */
  gym: string;
  /** Organizer/supporter group name (e.g., "後援会 TEAM ARENA") */
  organizer: string;
  /** Fighter's main photo URL (16:9 aspect ratio recommended) */
  imageUrl?: string;
  /** Short bio or description */
  bio: string;
}

// ==================== Home Page Configuration ====================

export interface HomePageConfig {
  hero: {
    /** Main catchphrase/tagline */
    catchphrase: string;
    /** CTA button text */
    ctaButtonText: string;
    /** Subtitle under the CTA button */
    ctaSubtext: string;
  };
  trust: {
    /** Description of how the smart contract works */
    description: string;
    /** Button text to learn more */
    learnMoreButtonText: string;
  };
}

// ==================== Support Page Configuration ====================

export interface SupportPageConfig {
  /** Title displayed on support page */
  title: string;
  /** Main description of the support system */
  description: string;
  /** Success message after support */
  successMessage: string;
  /** Generic error message */
  errorMessage: string;
  dao: {
    /** DAO description */
    description: string;
  };
}

// ==================== Exclusive Content Configuration ====================

export type ContentType = "video" | "audio" | "text" | "code" | "image";

export interface ContentItem {
  /** Unique content ID */
  id: string;
  /** Content title */
  title: string;
  /** Content description */
  description: string;
  /** Content type */
  type: ContentType;
  /** Required NFT count to unlock */
  requiredNft: number;
  /** Actual content (URL for media, text for text/code) */
  content: string;
}

export interface ExclusiveContentConfig {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** List of exclusive content items */
  contentItems: ContentItem[];
  footer: {
    /** Description text in footer section */
    description: string;
    /** CTA button text */
    ctaButtonText: string;
  };
}

// ==================== My Page Configuration ====================

export interface MyPageConfig {
  /** Page title */
  title: string;
  /** Page description */
  description: string;
  /** Message when wallet is not connected */
  walletNotConnectedMessage: string;
  supportHistory: {
    /** Section title */
    title: string;
  };
  footer: {
    /** Encouraging message to support again */
    message: string;
    /** CTA button text */
    ctaButtonText: string;
  };
}

// ==================== Admin Page Configuration ====================

export interface AdminPageConfig {
  distributionSettings: {
    /** Section title */
    title: string;
    /** Update success message */
    updateSuccessMessage: string;
    /** Update error message */
    updateErrorMessage: string;
  };
  distributionExecution: {
    /** Section title */
    title: string;
    /** Execute success message */
    executeSuccessMessage: string;
    /** Execute error message */
    executeErrorMessage: string;
    /** Bonus distribution success message template (use {amount} placeholder) */
    bonusSuccessMessage: string;
    /** Bonus distribution error message */
    bonusErrorMessage: string;
  };
  eventHistory: {
    /** Section title */
    title: string;
  };
}

// ==================== Rank Configuration ====================
// Ranks are based on total support amount (not NFT count)

export interface RankConfig {
  bronze: {
    label: string;
    icon: string;
    minAmount: number; // Minimum support amount in USDC
  };
  silver: {
    label: string;
    icon: string;
    minAmount: number;
  };
  gold: {
    label: string;
    icon: string;
    minAmount: number;
  };
  platinum: {
    label: string;
    icon: string;
    minAmount: number;
  };
}

// ==================== Main Configuration ====================

export interface AppConfig {
  site: SiteConfig;
  fighter: FighterInfo;
  homePage: HomePageConfig;
  supportPage: SupportPageConfig;
  exclusiveContent: ExclusiveContentConfig;
  myPage: MyPageConfig;
  adminPage: AdminPageConfig;
  ranks: RankConfig;
}
