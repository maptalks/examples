import { action, makeObservable, observable } from "mobx";

export class Store {
  constructor() {
    makeObservable(this);
  }

  @observable language: Language | null = null;
  @observable tab = "basic";
  @observable selectedKey = "";
  @observable code = "";

  @action setLanguage(language: Language) {
    this.language = language;
  }

  @action setTab(tab: string) {
    this.tab = tab;
  }

  @action setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  @action setCode(code: string) {
    this.code = code;
  }

  @action init() {
    this.language = null;
    this.tab = "basic";
    this.selectedKey = "";
    this.code = "";
  }
}
