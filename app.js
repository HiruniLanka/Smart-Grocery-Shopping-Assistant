let groceryList = [];
let purchaseHistory = {
    "milk": { lastBought: 7 },
    "eggs": { lastBought: 2 },
    "bread": { lastBought: 1 },
    "yogurt": { lastBought: 5 },
    "cheese": { lastBought: 10 }
};

let healthierOptions = {
    "white bread": "brown bread",
    "sugar": "jaggery",
    "butter": "low-fat butter",
    "chips": "baked chips"
};

let expiryData = [
    { item: "yogurt", daysLeft: 1 },
    { item: "cheese", daysLeft: 3 },
    { item: "spinach", daysLeft: 2 }
];

function print(msg) {
    const outputDiv = document.getElementById("output");
    outputDiv.innerHTML += `<p>🟢 Assistant: ${msg}</p>`;
    outputDiv.scrollTop = outputDiv.scrollHeight; // auto-scroll
}

// ---------------- COMMAND PROCESSING ----------------
function processCommand() {
    let cmd = document.getElementById("userInput").value.toLowerCase().trim();
    document.getElementById("userInput").value = "";

    if (cmd.startsWith("add ")) {
        let item = cmd.replace("add ", "").trim();
        addItem(item);
    } 
    else if (cmd.startsWith("remove ")) {
        let item = cmd.replace("remove ", "").trim();
        removeItem(item);
    } 
    else if (cmd === "show list") {
        print("Your Grocery List: " + (groceryList.length > 0 ? groceryList.join(", ") : "List is empty."));
    } 
    else if (cmd === "clear list") {
        groceryList = [];
        print("Grocery list cleared.");
    } 
    else if (cmd === "expiry") {
        checkExpiringItems();
    } 
    else if (cmd === "suggest missing") {
        suggestMissingItems();
    } 
    else if (cmd.startsWith("healthier ")) {
        let item = cmd.replace("healthier ", "").trim();
        suggestHealthierOption(item);
    } 
    else if (cmd === "history") {
        showHistory();
    } 
    else if (cmd === "help") {
        showHelp();
    }
    else {
        print("How can I help you? : add / remove / show list / clear list / expiry / suggest missing / healthier ITEM / history / help");
    }
}

// ---------------- COMMAND FUNCTIONS ----------------
function addItem(item) {
    groceryList.push(item);
    print(item + " added.");

    // RULE-BASED REASONING: suggest adding frequently bought items
    if (purchaseHistory[item]) {
        let days = purchaseHistory[item].lastBought;
        if (days >= 7) {
            print(`You bought ${item} last week. Should I add it again?`);
            groceryList.push(item);
            print(item + " added.");
        }
    }

    // HEALTHIER SUBSTITUTE CHECK
    if (healthierOptions[item]) {
        let healthy = healthierOptions[item];
        print(`Healthier alternative available: ${healthy}. Should I replace it?`);
    }

    // Update purchase history
    if (purchaseHistory[item]) {
        purchaseHistory[item].lastBought = 0; // reset counter
    } else {
        purchaseHistory[item] = { lastBought: 0 };
    }
}

function removeItem(item) {
    const index = groceryList.indexOf(item);
    if (index >= 0) {
        groceryList.splice(index, 1);
        print(item + " removed from the list.");
    } else {
        print(item + " not found in your list.");
    }
}

function checkExpiringItems() {
    expiryData.forEach(itemInfo => {
        if (itemInfo.daysLeft <= 2) {
            print(`⚠️ Reminder: Your ${itemInfo.item} is expiring in ${itemInfo.daysLeft} day(s)!`);
        }
    });
}

function suggestMissingItems() {
    let suggestions = [];
    for (let item in purchaseHistory) {
        if (!groceryList.includes(item)) {
            // If frequently bought or not added recently
            if (purchaseHistory[item].lastBought >= 5) {
                suggestions.push(item);
            }
        }
    }
    if (suggestions.length > 0) {
        print("Based on your history, you might need: " + suggestions.join(", "));
    } else {
        print("No missing items detected based on your purchase history.");
    }
}

function suggestHealthierOption(item) {
    if (healthierOptions[item]) {
        print(`Healthier alternative for ${item}: ${healthierOptions[item]}`);
    } else {
        print(`No healthier alternative found for ${item}`);
    }
}

function showHistory() {
    let historyItems = Object.keys(purchaseHistory);
    if (historyItems.length > 0) {
        print("Your purchase history: " + historyItems.join(", "));
    } else {
        print("No purchase history available.");
    }
}

function showHelp() {
    print(`Available commands: 
    - add ITEM
    - remove ITEM
    - show list
    - clear list
    - expiry
    - suggest missing
    - healthier ITEM
    - history
    - help`);
}

// ---------------- AUTO-INCREMENT DAYS FOR HISTORY (OPTIONAL) ----------------
// Simulate days passing for rule-based reasoning
setInterval(() => {
    for (let item in purchaseHistory) {
        purchaseHistory[item].lastBought += 1;
    }
}, 10000); // every 10 seconds = 1 day (for demo purposes)
