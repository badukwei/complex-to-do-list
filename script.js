// Select DOM elements
const changeModeButton = document.querySelector(".change-mode-button");
const body = document.querySelector(".body");
const input = document.querySelector(".input");
const taskList = document.querySelector(".task-list");
const taskAmountText = document.querySelector(".text-amount");

// Define the elements and their attributes for changing the mode
const elements = [
  {
    selector: ".background-img",
    attribute: "src",
    template: "./images/bg-desktop-{mode}.jpg",
  },
  {
    selector: ".change-mode-button",
    attribute: "src",
    template: "./images/icon-{mode}.svg",
  },
  {
    selector: ".input-container",
    attribute: "class",
    template: "input-container input-container-{mode}",
  },
  { selector: ".input", attribute: "class", template: "input input-{mode}" },
  {
    selector: ".task-container",
    attribute: "class",
    template: "task-container task-container-{mode}",
  },
  {
    selector: ".task-item",
    attribute: "class",
    template: "task-item task-item-{mode}",
    isNodeList: true,
  },
  {
    selector: ".task-text",
    attribute: "class",
    template: "task-text task-text-{mode}",
    isNodeList: true,
  },
  {
    selector: ".delete__span",
    attribute: "class",
    template: "delete__span delete__{mode}",
    isNodeList: true,
  },
];

// Define the initial tasks with unique IDs
let tasks = [
  {
    id: 1,
    text: "Build to-do list",
    isActive: true,
  },
  {
    id: 2,
    text: "Code review",
    isActive: false,
  },
  {
    id: 3,
    text: "Fix bugs",
    isActive: true,
  },
];

// Global state variables
let isLightMode = true;
let taskIdCounter = tasks.length;

/**
 * Change the theme mode.
 */
function changeMode() {
  isLightMode = !isLightMode;
  const mode = isLightMode ? "light" : "dark";

  body.setAttribute("class", `body ${mode}`);

  elements.forEach(({ selector, attribute, template, isNodeList }) => {
    const el = document.querySelectorAll(selector);
    const value = template.replace("{mode}", mode);

    if (isNodeList) {
      el.forEach((e) => e.setAttribute(attribute, value));
    } else {
      el[0].setAttribute(attribute, value);
    }
  });
}

// Add event listener for the change mode button
changeModeButton.addEventListener("click", changeMode);

/**
 * Generate a unique ID for a task.
 * @returns {number} The unique ID.
 */
function generateUniqueId() {
  taskIdCounter += 1;
  return taskIdCounter;
}

/**
 * Create a DOM element with given parameters.
 * @param {string} tag - The tag name of the element.
 * @param {string} className - The class name of the element.
 * @param {string} text - The text content of the element.
 * @param {Array} [children=[]] - An array of child elements.
 * @param {string} [html=""] - The inner HTML content of the element.
 * @returns {HTMLElement} The created DOM element.
 */
function createElement(tag, className, text, children = [], html = "") {
  const element = document.createElement(tag);
  if (className) {
    element.className = className;
  }
  children.forEach((child) => {
    element.appendChild(child);
  });
  if (text) {
    element.textContent = text;
  }
  if (html) {
    element.innerHTML = html;
  }
  return element;
}

/**
 * Display the number of tasks remaining.
 */
function displayTaskAmount() {
  let taskAmount = tasks.length;
  taskAmountText.textContent = `${taskAmount} item${
    taskAmount > 1 ? "s" : ""
  } left`;
}

displayTaskAmount();

/**
 * Remove the task item from the DOM.
 * @param {HTMLElement} taskItem - The task item to remove.
 */
function deleteTaskItem(taskItem) {
  taskItem.remove();
}

/**
 * Create a task item DOM element from a task object.
 * @param {Object} task - The task object.
 * @param {number} task.id - The ID of the task.
 * @param {string} task.text - The text content of the task.
 * @returns {HTMLElement} The created task item DOM element.
 */
function createTaskItem(task) {
  const { id, text: taskText } = task;
  const taskItem = createElement("div", "task-item task-item-light", "", [
    createElement("div", "task-content", "", [
      createElement(
        "div",
        "button",
        "",
        [],
        `<svg class="check-img" xmlns="http://www.w3.org/2000/svg" width="11" height="9">
          <path
            fill="none"
            stroke="#FFF"
            stroke-width="2"
            d="M1 4.304L3.696 7l6-6"
          />
        </svg>`
      ),
      createElement("span", "task-text task-text-light", taskText),
    ]),
    createElement("div", "delete", "", [
      createElement("span", "delete__span delete__light", ""),
      createElement("span", "delete__span delete__light", ""),
    ]),
  ]);

  const taskButton = taskItem.querySelector(".button");
  const checkImg = taskItem.querySelector(".check-img");
  // Event listener for checking the task when click the toggleButton
  taskButton.addEventListener("click", () => {
    task.isActive = !task.isActive;
    checkImg.setAttribute("class", task.isActive ? "check-img" : "check-img show")
  });

  const deleteButton = taskItem.querySelector(".delete");
  // Event listener for deleting the task when click the deleteButton
  deleteButton.addEventListener("click", () => {
    deleteTaskItem(taskItem);
    tasks = tasks.filter((item) => item.id !== id);
    displayTaskAmount();
  });

  return taskItem;
}

// Event listener for adding new tasks when pressing the Enter key
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    const taskText = event.target.value;
    if (taskText) {
      const newTask = {
        id: generateUniqueId(),
        text: taskText,
        isActive: true,
      };
      const taskItem = createTaskItem(newTask);
      taskList.appendChild(taskItem);
      event.target.value = "";
      tasks = [...tasks, newTask];
      displayTaskAmount();
    }
  }
});

// Execute the displayTaskAmount function when the document is loaded
document.addEventListener("DOMContentLoaded", () => {
  tasks.forEach((task) => {
    const taskItem = createTaskItem(task);
    taskList.appendChild(taskItem);
  });
});
