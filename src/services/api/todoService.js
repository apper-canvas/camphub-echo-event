import todoListsData from "@/services/mockData/todoLists.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

let todoLists = [...todoListsData];

export const todoService = {
  async getListsByProject(projectId) {
    await delay(250);
    return todoLists.filter(list => list.projectId === projectId.toString()).map(list => ({ ...list }));
  },

  async createList(projectId, name) {
    await delay(300);
    const maxId = Math.max(...todoLists.map(l => l.Id), 0);
    const newList = {
      Id: maxId + 1,
      projectId: projectId.toString(),
      name,
      tasks: [],
      createdAt: new Date().toISOString()
    };
    todoLists.push(newList);
    return { ...newList };
  },

  async updateList(listId, updates) {
    await delay(200);
    const listIndex = todoLists.findIndex(l => l.Id === parseInt(listId));
    if (listIndex === -1) {
      throw new Error("List not found");
    }
    todoLists[listIndex] = {
      ...todoLists[listIndex],
      ...updates
    };
    return { ...todoLists[listIndex] };
  },

  async deleteList(listId) {
    await delay(250);
    const listIndex = todoLists.findIndex(l => l.Id === parseInt(listId));
    if (listIndex === -1) {
      throw new Error("List not found");
    }
    const deleted = todoLists.splice(listIndex, 1)[0];
    return { ...deleted };
  },

  async addTask(listId, taskData) {
    await delay(300);
    const listIndex = todoLists.findIndex(l => l.Id === parseInt(listId));
    if (listIndex === -1) {
      throw new Error("List not found");
    }
    
    const list = todoLists[listIndex];
    const maxTaskId = Math.max(...list.tasks.map(t => parseInt(t.id)), 0);
    const newTask = {
      id: (maxTaskId + 1).toString(),
      listId: listId.toString(),
      title: taskData.title,
      completed: false,
      assignee: taskData.assignee || "",
      dueDate: taskData.dueDate || null,
      createdAt: new Date().toISOString()
    };
    
    list.tasks.push(newTask);
    return { ...newTask };
  },

  async updateTask(listId, taskId, updates) {
    await delay(200);
    const listIndex = todoLists.findIndex(l => l.Id === parseInt(listId));
    if (listIndex === -1) {
      throw new Error("List not found");
    }
    
    const list = todoLists[listIndex];
    const taskIndex = list.tasks.findIndex(t => t.id === taskId.toString());
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    list.tasks[taskIndex] = {
      ...list.tasks[taskIndex],
      ...updates
    };
    return { ...list.tasks[taskIndex] };
  },

  async deleteTask(listId, taskId) {
    await delay(200);
    const listIndex = todoLists.findIndex(l => l.Id === parseInt(listId));
    if (listIndex === -1) {
      throw new Error("List not found");
    }
    
    const list = todoLists[listIndex];
    const taskIndex = list.tasks.findIndex(t => t.id === taskId.toString());
    if (taskIndex === -1) {
      throw new Error("Task not found");
    }
    
    const deleted = list.tasks.splice(taskIndex, 1)[0];
    return { ...deleted };
  }
};