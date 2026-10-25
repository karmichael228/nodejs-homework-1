'use strict';

const readline = require('node:readline');

function ticketPrice(category) {
  switch (category) {
    case 1:
      return 300;
    case 2:
      return 500;
    case 3:
      return 900;
    default:
      return 0;
  }
}

function maxTickets(budget, price) {
  if (!Number.isFinite(budget) || !Number.isFinite(price) || budget < 0 || price <= 0) {
    return 0;
  }

  let count = 0;
  let remaining = budget;

  while (remaining >= price) {
    remaining -= price;
    count++;
  }

  return count;
}

function printTicketResult(category, budget) {
  const price = ticketPrice(category);

  if (price === 0) {
    console.log('неизвестная категория');
    return;
  }

  const count = maxTickets(budget, price);
  console.log(`Категория ${category}, билет ${price} руб., бюджет ${budget} руб.: можно купить ${count} шт.`);
}

function deliveryPrice(distance, total) {
  if (total >= 3000 || distance <= 3) {
    return 0;
  }

  if (distance <= 10) {
    return 200;
  }

  return 200 + (distance - 10) * 25;
}

function printDelivery(distance, total) {
  const price = deliveryPrice(distance, total);
  console.log(`Расстояние ${distance} км, заказ ${total} руб.: доставка ${price} руб.`);
}

function printSteps(height) {
  let count = 0;

  for (let step = 1; step <= height; step++) {
    if (step === 4) {
      continue;
    }

    // Предупреждение нужно, только если запрошены ступени после десятой.
    if (step > 10) {
      console.log('Дальше лестница не построена');
      break;
    }

    console.log(`Ступень ${step}`);
    count++;
  }

  console.log(`Всего построено: ${count}`);
}

function parseNonNegativeNumber(answer) {
  if (answer === null || answer.trim() === '') {
    throw new Error('некорректное число');
  }

  const number = Number(answer);
  if (!Number.isFinite(number) || number < 0 || number > Number.MAX_SAFE_INTEGER) {
    throw new Error('некорректное число');
  }

  return number;
}

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  // Итератор сохраняет строки и при интерактивном вводе, и при вводе из файла.
  const lines = rl[Symbol.asyncIterator]();

  async function ask(prompt) {
    process.stdout.write(prompt);
    const answer = await lines.next();
    return answer.done ? null : answer.value.trim();
  }

  try {
    console.log('Выберите задачу:');
    console.log('1 — билетная касса');
    console.log('2 — доставка заказа');
    console.log('3 — лестница');
    const choice = await ask('Ваш выбор: ');

    switch (choice) {
      case '1': {
        const categoryAnswer = await ask('Категория билета: ');
        const budgetAnswer = await ask('Бюджет: ');
        const category = categoryAnswer === null || categoryAnswer === ''
          ? NaN : Number(categoryAnswer);

        // Для неизвестной категории по условию выводится только это сообщение.
        if (ticketPrice(category) === 0) {
          printTicketResult(category, 0);
          break;
        }

        printTicketResult(category, parseNonNegativeNumber(budgetAnswer));
        break;
      }
      case '2': {
        const distance = parseNonNegativeNumber(await ask('Расстояние: '));
        const total = parseNonNegativeNumber(await ask('Сумма заказа: '));
        printDelivery(distance, total);
        break;
      }
      case '3': {
        const height = parseNonNegativeNumber(await ask('Высота лестницы: '));
        if (!Number.isInteger(height)) {
          throw new Error('высота должна быть целым числом');
        }
        printSteps(height);
        break;
      }
      default:
        console.log('такой задачи нет');
    }
  } catch (error) {
    console.log(error.message);
  } finally {
    rl.close();
  }
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}

module.exports = {
  ticketPrice,
  maxTickets,
  printTicketResult,
  deliveryPrice,
  printDelivery,
  printSteps,
};
