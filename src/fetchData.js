const API_URL = 'https://random-persona.herokuapp.com/random-persona';
const cardElement = document.getElementsByClassName('card')[0];
const cardLeftSide = document.getElementsByClassName('card-left-side')[0];
const cardRightSide = document.getElementsByClassName('card-right-side')[0];
const cardWidth = 320;
const animationDuration = 1000;
let pos1 = 0,
  pos3 = 0;
cardElement.ontouchmove = dragMouseDown;
cardElement.onmousedown = dragMouseDown;
cardElement.onmouseup = dragMouseUp;
document.getElementsByClassName('btn-heart')[0].onclick = () => swipeLeft();
document.getElementsByClassName('btn-x')[0].onclick = () => swipeRight();
document.getElementsByClassName('avatar')[0].onload = () => {
  cardElement.classList.add('anim-fade-in');
  setTimeout(() => {
    cardElement.classList.remove('anim-fade-in');
    cardElement.style.opacity = '100%';
  }, animationDuration);
};
getNewPerson();

async function getNewPerson() {
  await fetch(API_URL)
    .then((data) => data.json())
    .then((person) => {
      displayData(person.data);
    });
}

function displayData(person) {
  const avatar = document.getElementsByClassName('avatar')[0];
  const gender = document.getElementsByClassName('gender')[0];
  const name = document.getElementsByClassName('name')[0];
  const occupation = document.getElementsByClassName('occupation')[0];

  avatar.src = person.avatar;
  if (person.gender === 'male') {
    gender.classList.add('gender-male');
  } else {
    gender.classList.add('gender-female');
  }
  name.innerText = person.name.first + ', ' + person.age;
  occupation.innerText = person.occupation;
}

function dragMouseDown(e) {
  e = e || window.event;
  e.preventDefault();
  // get the mouse cursor position at startup
  pos3 = e.clientX;
  document.onmouseup = closeDragElement;
  document.onmousemove = elementDrag;
}

function elementDrag(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position
  pos1 = pos3 - e.clientX;
  pos3 = e.clientX;
  // set the element's new position
  let leftPos = cardElement.offsetLeft - pos1;
  if (leftPos < 0) leftPos = 0;
  if (leftPos + cardWidth > window.innerWidth)
    leftPos = window.innerWidth - cardWidth;
  cardElement.style.left = `${leftPos}px`;

  // highlight which side the card is being swiped
  if (leftPos + cardWidth / 2 < window.innerWidth * 0.5) {
    cardRightSide.style.opacity = '0%';
    cardLeftSide.style.opacity = '100%';
  } else {
    cardRightSide.style.opacity = '100%';
    cardLeftSide.style.opacity = '0%';
  }
}

function closeDragElement() {
  // stop moving when mouse button is released
  document.onmouseup = null;
  document.onmousemove = null;
}

function dragMouseUp(e) {
  e = e || window.event;
  e.preventDefault();
  // calculate the new cursor position
  pos1 = pos3 - e.clientX;
  pos3 = e.clientX;
  const leftPos = cardElement.offsetLeft - pos1;

  // remove card-side highlight
  cardLeftSide.style.opacity = '0%';
  cardRightSide.style.opacity = '0%';

  if (leftPos + cardWidth / 2 < window.innerWidth * 0.4) {
    swipeLeft();
    return;
  }
  if (leftPos + cardWidth / 2 > window.innerWidth * 0.6) {
    swipeRight();
    return;
  }

  cardElement.style.left = 'calc(50% - 160px)';
}

function swipeLeft() {
  cardElement.classList.add('anim-swipe-left');
  setTimeout(() => {
    cardElement.style.left = 'calc(50% - 160px)';
    cardElement.style.opacity = '0%';
    cardElement.classList.remove('anim-swipe-left');
    getNewPerson();
  }, animationDuration);
}

function swipeRight() {
  cardElement.classList.add('anim-swipe-right');
  setTimeout(() => {
    cardElement.style.left = 'calc(50% - 160px)';
    cardElement.style.opacity = '0%';
    cardElement.classList.remove('anim-swipe-right');
    getNewPerson();
  }, animationDuration);
}
