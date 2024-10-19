const fs = require('fs');
const readline = require('readline');

// File to store tasks
const TASKS_FILE = 'tasks.json';

// Readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Load tasks from JSON file with error handling
function loadTasks() {
  try {
    if (fs.existsSync(TASKS_FILE)) {
      const data = fs.readFileSync(TASKS_FILE);
      const parsedData = JSON.parse(data);
      return Array.isArray(parsedData) ? parsedData : [];
    }
  } catch (error) {
    console.error("Error reading the tasks file:", error);
  }
  return [];
}

// Save tasks to JSON file with error handling
function saveTasks(tasks) {
  try {
    fs.writeFileSync(TASKS_FILE, JSON.stringify(tasks, null, 2));
  } catch (error) {
    console.error("Error saving the tasks file:", error);
  }
}

// Display all tasks
function displayTasks(tasks) {
  if (tasks.length === 0) {
    console.log("No tasks available.");
    return;
  }

  console.log("\nTask List:");
  tasks.forEach((task) => {
    const status = task.completed ? "Completed" : "Incomplete";
    console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${status}`);
  });
}

// Create a new task
function createTask(tasks) {
  rl.question("Enter task description: ", (description) => {
    if (!description) {
      console.log("Task description cannot be empty.");
      return showMenu(tasks);
    }
    
    const task = {
      id: tasks.length + 1,
      description: description,
      completed: false
    };
    
    tasks.push(task);
    saveTasks(tasks);
    console.log(`Task '${description}' created successfully.`);
    showMenu(tasks);
  });
}

// Update task description
function updateTask(tasks) {
  rl.question("Enter task ID to update: ", (id) => {
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
      console.log(`Task with ID ${id} not found.`);
      return showMenu(tasks);
    }

    rl.question("Enter new description: ", (newDescription) => {
      if (!newDescription) {
        console.log("New description cannot be empty.");
        return showMenu(tasks);
      }
      
      task.description = newDescription;
      saveTasks(tasks);
      console.log(`Task ID ${id} updated successfully.`);
      showMenu(tasks);
    });
  });
}

// Remove a task
function removeTask(tasks) {
  rl.question("Enter task ID to remove: ", (id) => {
    const index = tasks.findIndex(t => t.id === parseInt(id));
    if (index === -1) {
      console.log(`Task with ID ${id} not found.`);
    } else {
      tasks.splice(index, 1);
      saveTasks(tasks);
      console.log(`Task ID ${id} removed successfully.`);
    }
    showMenu(tasks);
  });
}

// Toggle task completion status
function toggleTask(tasks) {
  rl.question("Enter task ID to toggle completion: ", (id) => {
    const task = tasks.find(t => t.id === parseInt(id));
    if (!task) {
      console.log(`Task with ID ${id} not found.`);
    } else {
      task.completed = !task.completed;
      saveTasks(tasks);
      const status = task.completed ? "Completed" : "Incomplete";
      console.log(`Task ID ${id} marked as ${status}.`);
    }
    showMenu(tasks);
  });
}

// Search tasks by description
function searchTasks(tasks) {
  rl.question("Enter keyword to search: ", (keyword) => {
    const results = tasks.filter(task => task.description.toLowerCase().includes(keyword.toLowerCase()));

    if (results.length > 0) {
      console.log("\nSearch Results:");
      results.forEach((task) => {
        const status = task.completed ? "Completed" : "Incomplete";
        console.log(`ID: ${task.id}, Description: ${task.description}, Status: ${status}`);
      });
    } else {
      console.log("No matching tasks found.");
    }
    showMenu(tasks);
  });
}

// Display the main menu
function showMenu(tasks) {
  console.log("\n--- Task Manager ---");
  console.log("1. Create a new task");
  console.log("2. View all tasks");
  console.log("3. Toggle task completion");
  console.log("4. Remove a task");
  console.log("5. Update task description");
  console.log("6. Search tasks");
  console.log("7. Exit");

  rl.question("Choose an option: ", (choice) => {
    switch (choice) {
      case '1':
        createTask(tasks);
        break;
      case '2':
        displayTasks(tasks); // Calls the function to display tasks
        showMenu(tasks);
        break;
      case '3':
        toggleTask(tasks);
        break;
      case '4':
        removeTask(tasks);
        break;
      case '5':
        updateTask(tasks);
        break;
      case '6':
        searchTasks(tasks);
        break;
      case '7':
        console.log("Task Manager closed.");
        rl.close();
        break;
      default:
        console.log("Invalid choice. Please try again.");
        showMenu(tasks);
    }
  });
}

// Run the task manager
function main() {
  const tasks = loadTasks();
  showMenu(tasks);
}

// Start the program
main();
