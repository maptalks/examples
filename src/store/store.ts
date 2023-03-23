import { getExampleByKey, getHtmlCodeTitle } from "@/utils";

import { makeAutoObservable } from "mobx";

export class Store {
  constructor() {
    makeAutoObservable(this);
  }

  language: Language | null = null;
  tab = "basic";
  filter = "";
  selectedKey = "";
  code = "";

  get example() {
    if (!this.selectedKey) {
      return null;
    }
    const example = getExampleByKey(this.selectedKey);
    return example;
  }

  get title() {
    const title = getHtmlCodeTitle(this.selectedKey, this.language);
    return title;
  }

  get description() {
    if (!this.example?.description || !this.language) {
      return "";
    }
    return this.example.description[this.language];
  }

  setLanguage(language: Language) {
    this.language = language;
  }

  setTab(tab: string) {
    this.tab = tab;
  }

  setFilter(filter: string) {
    this.filter = filter;
  }

  setSelectedKey(key: string) {
    this.selectedKey = key;
  }

  setCode(code: string) {
    this.code = code;
  }

  init() {
    this.language = null;
    this.tab = "basic";
    this.filter = "";
    this.selectedKey = "";
    this.code = "";
  }
}
