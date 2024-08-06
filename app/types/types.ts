export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: string;
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
  };
  HapticFeedback: any;
  CloudStorage: {
    getItem: (key: string, callback: (error: any, value: any) => void) => void;
    getItems: (
      keys: string[],
      callback: (error: any, values: any) => void
    ) => void;
    getKeys: (callback: (error: any, keys: string[]) => void) => void;
    removeItem: (
      key: string,
      callback?: (error: any, success: boolean) => void
    ) => void;
    removeItems: (
      keys: string[],
      callback?: (error: any, success: boolean) => void
    ) => void;
    setItem: (
      key: string,
      value: any,
      callback?: (error: any, success: boolean) => void
    ) => void;
  };
}

export interface IClickType {
  id: number;
  x: number;
  y: number;
}

export interface IBooster {
  id: number;
  name: string;
  image: string;
  cost: number;
  level: number;
  disabled: boolean;
  loading?: boolean;
  successMessage?: string;
  errorMessage?: string;
  onClick: (cost: number) => void;
}
