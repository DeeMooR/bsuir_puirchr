// Нажатие на карточку 

const openTest = (card) => {
  const theme_id = +card.id.split('-')[1];
  localStorage.setItem('theme_id', theme_id);

  window.location.href = 'test.html';
}

const cards = document.querySelectorAll('.card');

cards.forEach(card => {
  card.addEventListener('click', () => {
    openTest(card);
  });
});