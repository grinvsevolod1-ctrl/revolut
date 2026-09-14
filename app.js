// Connect your own routes/API here. No original bank services are loaded.
const dialog = document.querySelector('#action-dialog');
const titles = { signup: 'Get started', login: 'Your account', business: 'Business', kids: 'Kids & Teens', salary: 'Move your salary', savings: 'Explore savings', cards: 'Explore cards', air: 'Meet AIR', security: 'Explore security', invest: 'Explore investing' };
document.querySelectorAll('[data-action]').forEach(button => button.addEventListener('click', () => {
  const action = button.dataset.action;
  document.dispatchEvent(new CustomEvent('site:action', { detail: { action } }));
  document.querySelector('#dialog-title').textContent = titles[action] || 'Local preview';
  dialog.showModal();
}));
document.querySelector('#dismiss').addEventListener('click', () => dialog.close());
const menu = document.querySelector('.menu');
const navigation = document.querySelector('#navigation');
menu.addEventListener('click', () => menu.setAttribute('aria-expanded', navigation.classList.toggle('open')));
navigation.addEventListener('click', event => { if(event.target.closest('a,button')) { navigation.classList.remove('open'); menu.setAttribute('aria-expanded', 'false'); } });
document.querySelectorAll('[data-savings]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-savings]').forEach(item => { item.classList.toggle('selected', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  const captions = { Adventure: 'Save for your next adventure.', Wedding: 'Save for your special day.', Moving: 'Save for a place to call your own.' };
  document.querySelector('#savings-caption').textContent = captions[button.dataset.savings];
  document.querySelectorAll('[data-landscape]').forEach(image => image.classList.toggle('active', image.dataset.landscape === button.dataset.savings));
  document.querySelectorAll('[data-savings-ui]').forEach(image => image.classList.toggle('active', image.dataset.savingsUi === button.dataset.savings));
}));
