function doGet(e) {
  // Log all requests
  try {
    let ss = SpreadsheetApp.getActiveSpreadsheet();
    
    // If null, fall back to specific ID
    if (!ss) {
      ss = SpreadsheetApp.openById('XXX'); // Replace with your sheet ID
    }
    
    const logSheet = ss.getSheetByName('log');
    if (logSheet) {
      logSheet.appendRow([JSON.stringify(e)]);
    }
    
    const action = e.parameter.action;

    switch (action) {
      case 'login':
        return handleLogin(e);
      case 'register':  
        return handleRegister(e);
      case 'addTodo':
        return addTodo(e);
      case 'todoList': 
        return getTodoList(e);
      default:
        return createErrorResponse('Invalid action');
    }

    } catch (error) {
      console.error('Spreadsheet access error:', error);
      return createErrorResponse('Failed to access spreadsheet');
    }

}

function handleLogin(e) {
  const userID = e.parameter.userID;
  const password = e.parameter.pwd;
  
  const userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('user data');
  const users = userSheet.getDataRange().getValues();
  
  // Find user
  const user = users.find(row => row[1] === userID && row[2] === password);
  
  if (user) {
    return ContentService.createTextOutput("true");
  }
  return ContentService.createTextOutput("false");
}

function handleRegister(e) {
  const userID = e.parameter.userID;
  const password = e.parameter.pwd;
  
  const userSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('user data');
  const users = userSheet.getDataRange().getValues();
  
  // Check if user exists
  if (users.some(row => row[1] === userID)) {
    return ContentService.createTextOutput("false");
  }
  
  // Add new user
  userSheet.appendRow([new Date(), userID, password]);
  return ContentService.createTextOutput("true");
}

function addTodo(e) {
  const userID = e.parameter.userID;
  const title = e.parameter.titleID;
  const description = e.parameter.descriptionID;
  const date = e.parameter.dateID;
  
  try {
    const taskSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('task');
    taskSheet.appendRow([
      title,
      userID, 
      description,
      date,
      new Date() // timestamp
    ]);
    
    return ContentService.createTextOutput("true");
  } catch (error) {
    return ContentService.createTextOutput("false");
  }
}

function getTodoList(e) {
  const userID = e.parameter.userID;
  
  const taskSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('task');
  const tasks = taskSheet.getDataRange().getValues();
  
  // Filter tasks by userID and format response
  const userTasks = tasks
    .filter(row => row[1] === userID)
    .map(row => ({
      titleID: row[0],
      descriptionID: row[2], 
      dateID: row[3]
    }));
    
  return ContentService.createTextOutput(JSON.stringify(userTasks))
    .setMimeType(ContentService.MimeType.JSON);
}

function createErrorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'error',
    message: message
  })).setMimeType(ContentService.MimeType.JSON);
}