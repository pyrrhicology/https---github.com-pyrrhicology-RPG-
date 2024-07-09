let xp = 0;
let health = 100;
let gold = 50;
let currentWeapon = 0;
let fighting;
let monsterHealth;
let inventory = ["Knife"];

const button1 = document.querySelector("#button1");
const button2 = document.querySelector("#button2");
const button3 = document.querySelector("#button3");
const text = document.querySelector("#text");
const xpText = document.querySelector("#xpText");
const healthText = document.querySelector("#healthText");
const goldText = document.querySelector("#goldText");
const monsterStats = document.querySelector("#monsterStats");
const monsterNameText = document.querySelector("#monsterName");
const monsterHealthText = document.querySelector("#monsterHealth");
const healthBar = document.querySelector("#healthBar");
const background = document.querySelector("#background");

const weapons = [
  { name: "Knife", power: 5 },
  { name: "Sword", power: 30 },
  { name: "Greatsword", power: 50 },
  { name: "Moonlight Scythe", power: 100 }
];

const monsters = [
  { name: "undead", level: 2, health: 15 },
  { name: "fanged beast", level: 8, health: 60 },
  { name: "The Horror", level: 20, health: 300 },
  { name: "Skeleton", level: 5, health: 40 },
  { name: "Zombie", level: 10, health: 80 },
  { name: "Ghost", level: 15, health: 120 }
];

const locations = [
  {
    name: "town square",
    "button text": ["Go to store", "Go to dungeons", "Fight the horror"],
    "button functions": [goStore, goDungeons, fightHorror],
    text: "You are in the town square. You see a sign that says \"Store\".",
    bgImage: "url('images/town-square.jpg')"
  },
  {
    name: "store",
    "button text": ["Buy 10 health (10 gold)", "Buy weapon (30 gold)", "Go to town square"],
    "button functions": [buyHealth, buyWeapon, goTown],
    text: "You enter the store.",
    bgImage: "url('images/store.jpg')"
  },
  {
    name: "dungeons",
    "button text": ["Fight undead", "Fight fanged beast", "Go to town square"],
    "button functions": [fightUndead, fightBeast, goTown],
    text: "You enter the dungeons. You see some monsters.",
    bgImage: "url('images/cave.jpg')"
  },
  {
    name: "fight",
    "button text": ["Attack", "Dodge", "Run"],
    "button functions": [attack, dodge, goTown],
    text: "You are fighting a monster.",
    bgImage: "url('images/fight.jpg')"
  },
  {
    name: "kill monster",
    "button text": ["Go to town square", "Go to town square", "Go to town square"],
    "button functions": [goTown, goTown, easterEgg],
    text: 'The monster screams "Arg!" as it dies. You gain experience points and find gold.',
    bgImage: "url('images/kill-monster.jpg')"
  },
  {
    name: "lose",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You die. ☠️",
    bgImage: "url('images/lose.jpg')"
  },
  {
    name: "win",
    "button text": ["REPLAY?", "REPLAY?", "REPLAY?"],
    "button functions": [restart, restart, restart],
    text: "You defeat the horror! YOU WIN THE GAME! 🎉",
    bgImage: "url('images/win.jpg')"
  },
  {
    name: "easter egg",
    "button text": ["2", "8", "Go to town square?"],
    "button functions": [pickTwo, pickEight, goTown],
    text: "You find a secret game. Pick a number above. Ten numbers will be randomly chosen between 0 and 10. If the number you choose matches one of the random numbers, you win!",
    bgImage: "url('images/easter-egg.jpg')"
  },
  {
    name: "forest",
    "button text": ["Fight Skeleton", "Go to Town Square", "Go to Graveyard"],
    "button functions": [fightSkeleton, goTown, goGraveyard],
    text: "You find yourself in a dark and eerie forest.",
    bgImage: "url('images/forest.jpg')"
  },
  {
    name: "graveyard",
    "button text": ["Fight Zombie", "Fight Ghost", "Go to Town Square"],
    "button functions": [fightZombie, fightGhost, goTown],
    text: "The air grows cold as you enter a misty graveyard.",
    bgImage: "url('images/graveyard.jpg')"
  }
];

// initialize buttons
button1.onclick = goStore;
button2.onclick = goDungeons;
button3.onclick = fightHorror;

function update(location) {
  monsterStats.style.display = "none";
  button1.innerText = location["button text"][0];
  button2.innerText = location["button text"][1];
  button3.innerText = location["button text"][2];
  button1.onclick = location["button functions"][0];
  button2.onclick = location["button functions"][1];
  button3.onclick = location["button functions"][2];
  text.innerText = location.text;
  background.style.backgroundImage = location.bgImage;
}

function goTown() {
  update(locations[0]);
}

function goStore() {
  update(locations[1]);
}

function goDungeons() {
  update(locations[2]);
}

function buyHealth() {
  if (gold >= 10) {
    gold -= 10;
    health += 10;
    goldText.innerText = gold;
    updateStats();
  } else {
    text.innerText = "You do not have enough gold to buy health.";
  }
}

function buyWeapon() {
  if (currentWeapon < weapons.length - 1) {
    if (gold >= 30) {
      gold -= 30;
      currentWeapon++;
      goldText.innerText = gold;
      let newWeapon = weapons[currentWeapon].name;
      text.innerText = "You now have a " + newWeapon + ".";
      inventory.push(newWeapon);
      text.innerText += " In your inventory you have: " + inventory;
      updateInventory();
    } else {
      text.innerText = "You do not have enough gold to buy a weapon.";
    }
  } else {
    text.innerText = "You already have the most powerful weapon!";
    button2.innerText = "Sell weapon for 15 gold";
    button2.onclick = sellWeapon;
  }
}

function sellWeapon() {
  if (inventory.length > 1) {
    gold += 15;
    goldText.innerText = gold;
    let currentWeapon = inventory.shift();
    text.innerText = "You sold a " + currentWeapon + ".";
    text.innerText += " In your inventory you have: " + inventory;
  } else {
    text.innerText = "Don't sell your only weapon!";
  }
  updateInventory();
}

function updateInventory() {
  const inventoryList = document.getElementById("inventoryList");
  inventoryList.innerHTML = "";
  inventory.forEach((item, index) => {
    const li = document.createElement("li");
    li.textContent = item;
    li.onclick = () => selectWeapon(index);
    if (index === currentWeapon) {
      li.classList.add("selected");
    }
    inventoryList.appendChild(li);
  });
}

function selectWeapon(index) {
  if (index !== currentWeapon) {
    currentWeapon = index;
    text.innerText = "You equipped the " + inventory[index] + ".";
    updateInventory();
  }
}

function goFight() {
  update(locations[3]);
  monsterHealth = monsters[fighting].health;
  monsterStats.style.display = "block";
  monsterNameText.innerText = monsters[fighting].name;
  monsterHealthText.innerText = monsterHealth;
}

function attack() {
  text.innerText = "You attack the " + monsters[fighting].name + " with your " + weapons[currentWeapon].name + ".";
  if (isMonsterHit()) {
    const damage = weapons[currentWeapon].power + Math.floor(Math.random() * xp) + 1;
    monsterHealth -= damage;
    text.innerText += " You deal " + damage + " damage.";
  } else {
    text.innerText += " You miss.";
  }
  updateStats();
  monsterHealthText.innerText = monsterHealth;

  if (monsterHealth <= 0) {
    fighting === 2 ? winGame() : defeatMonster();
  } else {
    monsterTurn();
  }

  if (Math.random() <= .1 && inventory.length !== 1) {
    text.innerText += " Your " + inventory.pop() + " breaks.";
    currentWeapon--;
  }
}

function getMonsterAttackValue(level) {
  const hit = (level * 5) - (Math.floor(Math.random() * xp));
  return hit > 0 ? hit : 0;
}

function isMonsterHit() {
  return Math.random() > .2 || health < 20;
}

function dodge() {
  text.innerText = "You dodge the attack from the " + monsters[fighting].name + ".";
}

function defeatMonster() {
  gold += Math.floor(monsters[fighting].level * 6.7);
  xp += monsters[fighting].level;
  goldText.innerText = gold;
  xpText.innerText = xp;
  update(locations[4]);
}

function lose() {
  update(locations[5]);
}

function winGame() {
  update(locations[6]);
}

function restart() {
  xp = 0;
  health = 100;
  gold = 50;
  currentWeapon = 0;
  inventory = ["Knife"];
  updateStats();
  goTown();
}

function easterEgg() {
  update(locations[7]);
}

function pickTwo() {
  pick(2);
}

function pickEight() {
  pick(8);
}

function pick(guess) {
  const numbers = [];
  while (numbers.length < 10) {
    numbers.push(Math.floor(Math.random() * 11));
  }
  text.innerText = "You picked " + guess + ". Here are the random numbers:\n";
  for (let i = 0; i < 10; i++) {
    text.innerText += numbers[i] + "\n";
  }
  if (numbers.includes(guess)) {
    text.innerText += "Right! You win 20 gold!";
    gold += 20;
    goldText.innerText = gold;
  } else {
    text.innerText += "Wrong! You lose 10 health!";
    health -= 10;
    updateStats();
    if (health <= 0) {
      lose();
    }
  }
}

function fightUndead() {
  fighting = 0;
  goFight();
}

function fightBeast() {
  fighting = 1;
  goFight();
}

function fightHorror() {
  fighting = 2;
  goFight();
}

function updateStats() {
  xpText.innerText = xp;
  healthText.innerText = health;
  goldText.innerText = gold;
  healthBar.style.width = health + "%";
}

function monsterTurn() {
  const damage = getMonsterAttackValue(monsters[fighting].level);
  health -= damage;
  updateStats();

  // Create and show pop-up
  const popup = document.createElement('div');
  popup.id = 'attackPopup';
  popup.innerHTML = `
    <p>${monsters[fighting].name} attacks!</p>
    <p>You take ${damage} damage.</p>
    <button id="closePopup">Continue</button>
  `;
  document.body.appendChild(popup);

  // Disable game buttons
  button1.disabled = true;
  button2.disabled = true;
  button3.disabled = true;

  // Add event listener to close pop-up
  document.getElementById('closePopup').addEventListener('click', function() {
    document.body.removeChild(popup);
    // Re-enable game buttons
    button1.disabled = false;
    button2.disabled = false;
    button3.disabled = false;

    if (health <= 0) {
      lose();
    }
  });
}

function fightSkeleton() {
  fighting = 3; // Index of the Skeleton in the monsters array
  goFight();
}

function fightZombie() {
  fighting = 4; // Index of the Zombie in the monsters array
  goFight();
}

function fightGhost() {
  fighting = 5; // Index of the Ghost in the monsters array
  goFight();
}

function initializeGame() {
  text.innerText = "Welcome to The Hunter. You take on the role of the Hunter and you must defeat the eldritch Horror that is preventing people from leaving the town. You are in the town square. Where do you want to go? Use the buttons below.";
  updateInventory();
  updateStats();
}

initializeGame();