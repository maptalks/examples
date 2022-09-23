const classlist = require('./classlist');
const examples = require('../../build/examples.json');

function bindTabClickEvent() {
  const tabs = document.querySelectorAll('.page-header .title');
  for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
    const tab = tabs[tabIndex];
    tab.addEventListener('click', () => {
      const menus = document.querySelectorAll('.sidebar .menu-area .menu');
      const activeMenu = document.querySelector(
        '.sidebar .menu-area .menu.show'
      );
      const activeTitle = document.querySelector('.page-header .title.active');
      if (activeTitle) {
        classlist.removeClass(activeTitle, 'active');
      }
      classlist.addClass(tab, 'active');
      if (activeMenu) {
        classlist.removeClass(activeMenu, 'show');
      }
      classlist.addClass(menus[tabIndex], 'show');
    });
  }
}

function initPageStatus() {
  const pathname = window.location.pathname;
  const tab = pathname.split('/')[3];
  const index = examples.findIndex((example) => tab === example.name);
  if (index > -1) {
    const tabs = document.querySelectorAll('.page-header .title');
    const ele = tabs[index];
    if (ele) {
      classlist.addClass(ele, 'active');
    }
    const menus = document.querySelectorAll('.sidebar .menu-area .menu');
    classlist.addClass(menus[index], 'show');
  } else {
    const menus = document.querySelectorAll('.sidebar .menu-area .menu');
    classlist.addClass(menus[0], 'show');
  }
}

initPageStatus();
bindTabClickEvent();
