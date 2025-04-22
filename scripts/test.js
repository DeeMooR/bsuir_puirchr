import { tests } from './config.js';

// Получение theme_id и tab_id

const theme_id = +localStorage.getItem('theme_id');
let tab_id = 1;
let answers = [];
let tab = [];

if (!theme_id) window.location.href = 'index.html';

// Обновление ошибки и результата

const errorElement = document.querySelector('.errorMessage');
const resultElement = document.querySelector('.resultMessage');

const updateError = (error) => {
  errorElement.style.display = !error ? 'none' : 'block';
  errorElement.textContent = error;
}
const updateResult = (result) => {
  resultElement.style.display = !result ? 'none' : 'block';
  resultElement.textContent = result;
}
const clearText = () => {
  updateError('');
  updateResult('');
}

// Заполнение вопросов

const fillQuestions = () => {
  const container = document.querySelector('.questions');
  container.innerHTML = "";

  const currentTest = tests.find(test => test.theme_id === theme_id);
  tab = currentTest.tabs.find(tab => tab.tab_id === tab_id);
  answers = [];
  
  const h1 = document.querySelector('h1');
  h1.textContent = currentTest.theme_title;
  
  tab.questions.forEach((question, index) => {
    const li = document.createElement('li');
    li.classList.add('question');

    const h3 = document.createElement('h3');
    h3.classList.add('question__title');
    h3.textContent = question.title;

    const div = document.createElement('div');
    div.classList.add('question__options');

    question.items.forEach(({text, weight}) => {
      const label = document.createElement('label');
      label.classList.add('question__label');
      label.textContent = text;
  
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'q' + index;
      input.dataset.weight = weight;
      
      const span = document.createElement('span');
      span.classList.add('checkmark');
  
      label.appendChild(input);
      label.appendChild(span);
      div.appendChild(label);
    });

    li.appendChild(h3);
    li.appendChild(div);
    container.appendChild(li);
  })
}

fillQuestions();

// Выбор варианта ответа

const handleInputClick = (inputs) => {
  inputs.forEach(input => {
    input.addEventListener('click', (e) => {
      clearText();
      const input = e.target;
      const questionNumber = input.name.replace('q', '');
      const weight = input.dataset.weight;
  
      const obj = answers.find(item => item.question === questionNumber);
      if (obj) {
        answers[obj.question].weight = weight;
      } else {
        answers.push({
          question: +questionNumber,
          weight: +weight
        });
      }
    });
  });
}

const inputs = document.querySelectorAll('input');
handleInputClick(inputs);

// Нажатие на табы 

const changeActiveTab = (id) => {
  clearText();
  const activeTab = document.querySelector('.tab__active');
  if (activeTab) activeTab.classList.remove('tab__active');

  const newActiveTab = document.getElementById(id);
  if (newActiveTab) newActiveTab.classList.add('tab__active');

  tab_id = +id.split('-')[1];
  fillQuestions();

  const inputs = document.querySelectorAll('input');
  handleInputClick(inputs)
}

const tabs = document.querySelectorAll('.tab');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    changeActiveTab(tab.id);
  });
});

// Проверка

const btnSend = document.querySelector('.buttons__send');

btnSend.addEventListener('click', () => {
  if (answers.length !== tab.questions.length) {
    updateError('Необходимо ответить на все вопросы!');
    return;
  }
  const sum = answers.reduce((acc, item) => acc + item.weight, 0);
  let resultText;
  let max;

  tab.result.forEach(item => {
    const [start, end] = item.bal.split('-');
    max = end;
    if (sum >= +start && sum <= +end) {
      resultText = `${sum}/${max} ${item.text}`;
    }
  })
  updateResult(resultText);
})

// Очистка формы

const btnReset = document.querySelector('.buttons__reset');

btnReset.addEventListener('click', () => {
  clearText();
  const inputs = document.querySelectorAll('input[type="radio"]');
  inputs.forEach(item => {
    item.checked = false;
  });
})
