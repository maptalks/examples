const classlist = require('./classlist');

const tabs = document.querySelectorAll('.page-header .title');
for (let tabIndex = 0; tabIndex < tabs.length; tabIndex++) {
  const tab = tabs[tabIndex];
  tab.addEventListener('click', () => {
    const activeTitle = document.querySelector('.page-header .title.active');
    if (activeTitle) {
      classlist.removeClass(activeTitle, 'active');
    }
    classlist.addClass(tab, 'active');
  });
}
