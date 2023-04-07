// Select DOM elements
const changeModeButton = document.querySelector(".change-mode-button");
const body = document.querySelector(".body");
const input = document.querySelector(".input");
const taskList = document.querySelector(".task-list");
const taskAmountText = document.querySelector(".text-amount");
const allFilterButton = document.querySelector(".filter-all");
const activeFilterButton = document.querySelector(".filter-active");
const completeFilterButton = document.querySelector(".filter-complete");
const clearButton = document.querySelector(".clear");

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
  { selector: ".input", attribute: "class", template: "input input-{mode} hover" },
  {
    selector: ".task-container",
    attribute: "class",
    template: "task-container task-container-{mode}",
  },
  {
    selector: ".button",
    attribute: "class",
    template: "button button-{mode}",
    isNodeList: true,
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
    const value = template.replace("{mode}", mode);

    if (isNodeList) {
      const nodeList = document.querySelectorAll(selector);
      nodeList.forEach((e) => e.setAttribute(attribute, value));
    } else {
      const el = document.querySelector(selector);
      el.setAttribute(attribute, value);
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
  const ActiveTask = tasks.filter((task) => task.isActive);
  const taskAmount = ActiveTask.length;
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
  const { id, text: taskText, isActive } = task;
  const taskItem = createElement("div", "task-item task-item-light", "", [
    createElement("div", "task-content hover active", "", [
      createElement(
        "div",
        `${isActive ? "button button-light" : "button button-light on"}`,
        "",
        [],
        `<svg class="${
          isActive ? "check-img" : "check-img show"
        }" xmlns="http://www.w3.org/2000/svg" width="11" height="9">
          <path
            fill="none"
            stroke="#FFF"
            stroke-width="2"
            d="M1 4.304L3.696 7l6-6"
          />
        </svg>`
      ),
      createElement(
        "span",
        `${
          isActive
            ? "task-text task-text-light"
            : "task-text task-text-light on"
        }`,
        taskText
      ),
    ]),
    createElement("div", "delete hover active", "", [
      createElement("span", "delete__span delete__light", ""),
      createElement("span", "delete__span delete__light", ""),
    ]),
  ]);

  const taskContent = taskItem.querySelector(".task-content");
  const taskButton = taskItem.querySelector(".button");
  const checkImg = taskItem.querySelector(".check-img");
  const taskTextSpan = taskItem.querySelector(".task-text");
  // Event listener for checking the task when click the toggleButton
  taskContent.addEventListener("click", () => {
    task.isActive = !task.isActive;
    taskButton.setAttribute("class", task.isActive ? "button" : "button on");
    checkImg.setAttribute(
      "class",
      task.isActive ? "check-img" : "check-img show"
    );
    taskTextSpan.setAttribute(
      "class",
      task.isActive
        ? "task-text task-text-light"
        : "task-text task-text-light on"
    );
    displayTaskAmount();
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

function displayFilteredTasks(condition) {
  taskList.innerHTML = ""; // Clear the task list

  const filteredTasks = tasks.filter(condition);

  filteredTasks.forEach((task) => {
    const taskItem = createTaskItem(task);
    taskList.appendChild(taskItem);
  });
}

function updateSelectedButton(selectedButton) {
  // Remove the 'on' and add off class from all buttons
  allFilterButton.classList.remove("on");
  allFilterButton.classList.add("off");
  activeFilterButton.classList.remove("on");
  activeFilterButton.classList.add("off");
  completeFilterButton.classList.remove("on");
  completeFilterButton.classList.add("off");
  // Add the 'on' class to the selected button
  selectedButton.classList.add("on");
  selectedButton.classList.remove("off");
}

function clearCompleteTask() {
  taskList.innerHTML = "";
  tasks = tasks.filter((task) => task.isActive);
  console.log(tasks);
  tasks.forEach((task) => {
    const taskItem = createTaskItem(task);
    taskList.appendChild(taskItem);
  });
}

activeFilterButton.addEventListener("click", () => {
  displayFilteredTasks((task) => task.isActive);
  updateSelectedButton(activeFilterButton);
});

completeFilterButton.addEventListener("click", () => {
  displayFilteredTasks((task) => !task.isActive);
  updateSelectedButton(completeFilterButton);
});

allFilterButton.addEventListener("click", () => {
  displayFilteredTasks(() => true);
  updateSelectedButton(allFilterButton);
});

clearButton.addEventListener("click", () => {
  clearCompleteTask();
  displayTaskAmount();
});

