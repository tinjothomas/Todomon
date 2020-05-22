//changing color of Text
function iterateCheckbox() {
    var checkBox = document.getElementsByClassName('checker')
    console.log(checkBox.length)

    for (var i = 0; i < checkBox.length; i++) {
        if (checkBox[i].getAttribute('data-value') == 'checked') {
            checkBox[i].checked = true;
        }
        checkBox[i].addEventListener("click", function (e) {
            updateDoc(e.target.getAttribute('data-id'))
        });

    }
}

function iterateDelete() {
    var deleteButton = document.getElementsByClassName('remove')
    console.log(deleteButton.length)

    for (var i = 0; i < deleteButton.length; i++) {
        deleteButton[i].addEventListener("click", function (e) {
            removeDoc(e.target.getAttribute('data-id'))
        });

    }
}