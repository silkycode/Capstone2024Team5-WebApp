function editLog(button) {
  var row = button.parentNode.parentNode; // Traverse up to the table row
  var cells = row.getElementsByTagName("td");

  // Get the current values
  var currentDate = cells[0].textContent;
  var currentTime = cells[1].textContent;
  var currentGlucoseLevel = cells[2].textContent;

  // Replace the cell content with input fields
  cells[0].innerHTML = '<input type="date" value="' + currentDate + '">';
  cells[1].innerHTML = '<input type="time" value="' + currentTime + '">';
  cells[2].innerHTML = '<input type="number" value="' + currentGlucoseLevel + '">';

  // Hide the Edit button and show the Confirm button
  button.style.display = "none";
  row.querySelector(".confirm-button").style.display = "inline-block";
}

function confirmEdit(button) {
  var row = button.parentNode.parentNode; // Traverse up to the table row
  var cells = row.getElementsByTagName("td");

  // Get the new values from the input fields
  var newDate = cells[0].querySelector("input").value;
  var newTime = cells[1].querySelector("input").value;
  var newGlucoseLevel = cells[2].querySelector("input").value;

  // Update the table with the new values
  cells[0].textContent = newDate;
  cells[1].textContent = newTime;
  cells[2].textContent = newGlucoseLevel;

  // Show the Edit button and hide the Confirm button
  row.querySelector(".edit-button").style.display = "inline-block";
  button.style.display = "none";
}
