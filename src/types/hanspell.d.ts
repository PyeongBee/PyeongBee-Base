declare module 'hanspell' {
  interface HanspellResult {
    token: string;
    suggestions: string[];
    info?: string;
    start?: number;
    end?: number;
  }

  type HanspellCallback = (result: HanspellResult) => void;
  type HanspellEndCallback = (end: boolean) => void;

  function hanspell(
    text: string,
    callback: HanspellCallback,
    endCallback: HanspellEndCallback
  ): void;

  export = hanspell;
}
