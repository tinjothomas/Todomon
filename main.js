var today = moment().format("MMM Do YY");
var yesterday = moment().subtract(1, "days").format("MMM Do YY");
var selectItems = document.getElementById("list-items");
var pendingItems = document.getElementById("pending-items");
var progressContainer = document.querySelector("#progress-container");
var progressBar = document.querySelector("#progress-bar");

//nedb Confi
var db = new Nedb({
  filename: "todomon",
  autoload: true,
});

//Inital data loading
getTodo(today);
getPendingTodo(yesterday);
percentage(today);

//Add button for todo list items
var addButton = document.getElementById("add-button");
addButton.addEventListener("click", function () {
  setTodo();
  percentage(today);
});

//inserting new todo item to the database
function setTodo() {
  var toDoItem = document.getElementById("todo-input").value;

  data = {
    toDo: toDoItem,
    time: Date.now(),
    date: today,
    completed: false,
  };

  db.insert(data, function (err, newDoc) {
    getTodo(today);
  });
}

$("#last-updated").html(moment().format("LL"));

//get todo items based on the day input
function getTodo(day) {
  db.find({ date: day })
    .sort({ time: -1 })
    .skip(0)
    .limit(0)
    .exec(function (err, docs) {
      console.log(docs);
      selectItems.innerHTML = "";
      docs.forEach(function (element) {
        selectItems.innerHTML += todoMarkup(element);
      });
      setEventListender();
    });
}

function setEventListender() {
  var cards = document.querySelectorAll(".remove");
  cards.forEach((card) =>
    card.addEventListener("click", function () {
      var doc = card.getAttribute("data-id");
      removeDoc(doc);
      getTodo(today);
    })
  );
}

function getPendingTodo(day) {
  db.find({ date: day })
    .sort({ time: -1 })
    .skip(0)
    .limit(0)
    .exec(function (err, docs) {
      console.log(docs);
      pendingItems.innerHTML = "";
      docs.forEach(function (element) {
        pendingItems.innerHTML += todoMarkup(element);
      });
    });
}

//remove a document from the database
function removeDoc(id) {
  db.remove({ _id: id }, {}, function (err, numRemoved) {
    console.log("document has been removed");
  });
}

//update a document from the database
function updateDoc(id, boolean) {
  db.update(
    { _id: id },
    { $set: { completed: boolean } },
    { multi: true },
    function (err, numReplaced) {
      console.log(numReplaced);
    }
  );
}

//set percentage from the given date
function percentage(day) {
  db.count({ date: day, completed: true }, function (err, completed) {
    var completed = completed;
    db.count({ date: day }, function (err, total) {
      var total = total;
      var barWidth = progressContainer.offsetWidth;
      progressBar.style.width = `${(completed * 100) / total}px`;
    });
  });
}

//creating todo items dynamically
function todoMarkup(element) {
  var checked = element.completed ? "checked" : "";
  return `
  <div class="todo-card">
<p>${element.toDo}</p>
<div class="content-left">
    <p>${moment(element.time).fromNow()}</p>
    <div class="actions">
        <div class="checkbox-container">
            <input class="checker" id="${element._id}" data-id="${
    element._id
  }" data-value="${element.status}" type="checkbox" ${checked}>
            <label for="${element._id}" class="checkbox-label"></label>
        </div>
        <div class="remove"" data-id="${element._id}">
        </div>
    </div>
</div>
</div>
  `;
}
