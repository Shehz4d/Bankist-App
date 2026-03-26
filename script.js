'use strict';

// ACCOUNTS
const account1 = {
  owner: 'Shehzad Khan',
  movements: [500, 300, -100, 700, -50],
  interestRate: 1.2,
  pin: 1111,
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-05T14:11:59.604Z',
    '2026-03-10T09:15:04.904Z',
    '2026-03-12T17:01:17.194Z',
    '2026-03-15T23:36:17.929Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [2000, -400, 500, -100, 1000],
  interestRate: 1.5,
  pin: 2222,
  movementsDates: [
    '2026-03-02T13:15:33.035Z',
    '2026-03-06T09:48:16.867Z',
    '2026-03-08T06:04:23.907Z',
    '2026-03-14T14:18:46.235Z',
    '2026-03-18T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Muzamil Saif',
  movements: [800, 300, -200, 400],
  interestRate: 1.3,
  pin: 3333,
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-03T14:11:59.604Z',
    '2026-03-09T09:15:04.904Z',
    '2026-03-11T17:01:17.194Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account4 = {
  owner: 'Areej Fatima',
  movements: [500, 400, -100, 300],
  interestRate: 1.1,
  pin: 4444,
  movementsDates: [
    '2026-03-02T10:17:24.185Z',
    '2026-03-05T14:11:59.604Z',
    '2026-03-07T09:15:04.904Z',
    '2026-03-10T17:01:17.194Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account5 = {
  owner: 'Momina Akhtar',
  movements: [700, -200, 300, 600],
  interestRate: 1.0,
  pin: 5555,
  movementsDates: [
    '2026-03-01T10:17:24.185Z',
    '2026-03-04T14:11:59.604Z',
    '2026-03-06T09:15:04.904Z',
    '2026-03-09T17:01:17.194Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4, account5];

// ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

// FUNCTIONS
const formatMovementDate = (dateStr, locale) => {
  const date = new Date(dateStr);
  const calcDaysPassed = (date1, date2) =>
    Math.round(Math.abs(date2 - date1) / (1000 * 60 * 60 * 24));

  const daysPassed = calcDaysPassed(new Date(), date);

  if (daysPassed === 0) return 'Today';
  if (daysPassed === 1) return 'Yesterday';
  if (daysPassed <= 7) return `${daysPassed} days ago`;

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
};

const formatCur = (value, locale, currency) =>
  new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);

const displayMovements = (acc, sort = false) => {
  containerMovements.innerHTML = '';

  const movsWithDates = acc.movements.map((mov, i) => ({
    movement: mov,
    date: acc.movementsDates[i],
  }));

  if (sort) movsWithDates.sort((a, b) => a.movement - b.movement);

  movsWithDates.forEach((obj, i) => {
    const type = obj.movement > 0 ? 'deposit' : 'withdrawal';
    const displayDate = formatMovementDate(obj.date, acc.locale);
    const formattedMov = formatCur(obj.movement, acc.locale, acc.currency);

    const html = `
      <div class="movements__row">
        <div class="movements__type movements__type--${type}">
          ${i + 1} ${type}
        </div>
        <div class="movements__date">${displayDate}</div>
        <div class="movements__value">${formattedMov}</div>
      </div>
    `;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = acc => {
  acc.balance = acc.movements.reduce((sum, mov) => sum + mov, 0);
  labelBalance.textContent = formatCur(acc.balance, acc.locale, acc.currency);
};

const calcDisplaySummary = acc => {
  const incomes = acc.movements
    .filter(mov => mov > 0)
    .reduce((a, b) => a + b, 0);
  labelSumIn.textContent = formatCur(incomes, acc.locale, acc.currency);

  const out = acc.movements.filter(mov => mov < 0).reduce((a, b) => a + b, 0);
  labelSumOut.textContent = formatCur(Math.abs(out), acc.locale, acc.currency);

  const interest = acc.movements
    .filter(mov => mov > 0)
    .map(deposit => (deposit * acc.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((a, b) => a + b, 0);
  labelSumInterest.textContent = formatCur(interest, acc.locale, acc.currency);
};

// New function: display current date in balance section
const displayCurrentDate = acc => {
  const now = new Date();
  const formattedDate = new Intl.DateTimeFormat(acc.locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(now);

  labelDate.textContent = formattedDate;
};

// Create usernames
const createUsernames = accs => {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
createUsernames(accounts);

let currentAccount, timer;

const startLogoutTimer = () => {
  let time = 300;

  const tick = () => {
    const min = String(Math.trunc(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    labelTimer.textContent = `${min}:${sec}`;

    if (time === 0) {
      clearInterval(timer);
      containerApp.style.opacity = 0;
      labelWelcome.textContent = 'Log in to get started';
      currentAccount = null;
    }

    time--;
  };

  tick();
  timer = setInterval(tick, 1000);
  return timer;
};

// EVENT HANDLERS
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value.toLowerCase(),
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]}`;
    containerApp.style.opacity = 1;
    inputLoginUsername.value = inputLoginPin.value = '';

    displayMovements(currentAccount);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
    displayCurrentDate(currentAccount); // ✅ show current date

    if (timer) clearInterval(timer);
    startLogoutTimer();
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(
    acc => acc.username === inputTransferTo.value.toLowerCase(),
  );

  inputTransferAmount.value = inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    const now = new Date().toISOString();
    currentAccount.movementsDates.push(now);
    receiverAcc.movementsDates.push(now);

    displayMovements(currentAccount);
    calcDisplayBalance(currentAccount);
    calcDisplaySummary(currentAccount);
    displayCurrentDate(currentAccount); // update date on transfer

    clearInterval(timer);
    startLogoutTimer();
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);
  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    setTimeout(() => {
      currentAccount.movements.push(amount);
      currentAccount.movementsDates.push(new Date().toISOString());
      displayMovements(currentAccount);
      calcDisplayBalance(currentAccount);
      calcDisplaySummary(currentAccount);
      displayCurrentDate(currentAccount); // update date on loan

      clearInterval(timer);
      startLogoutTimer();
    }, 2500);
  }
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', e => {
  e.preventDefault();
  if (
    inputCloseUsername.value.toLowerCase() === currentAccount?.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username,
    );
    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
    labelWelcome.textContent = 'Log in to get started';
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount, !sorted);
  sorted = !sorted;
});
