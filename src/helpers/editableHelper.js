export function editableTitle() {
    let div = document.getElementById('task-header');
    let h3 = document.getElementById('editable-text');

    let input = document.createElement('input');
    input.type = 'text';
    input.value = "Type your title here";
    input.className = "editable-input-title";

    div.replaceChild(input, h3);

    input.select();

    input.addEventListener('blur', replaceInputWithH3);
    input.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            replaceInputWithH3();
        }
    });

    function replaceInputWithH3() {
        if (input.value === "" || input.value === "Type your title here") {
            input.value = h3.textContent
        }
        h3.textContent = input.value;
        div.replaceChild(h3, input);
    }
}

export function editableDescription() {
    let divDescription = document.getElementById('editable-description');
    let h5Description = document.getElementById('editable-text-description');

    let textarea = document.createElement('textarea');
    textarea.rows = 10;
    textarea.cols = 90;
    textarea.value = "Type your description here...";

    divDescription.replaceChild(textarea, h5Description);

    textarea.select();

    textarea.addEventListener('blur', replaceTextareaWithH5);
    textarea.addEventListener('keyup', function (e) {
        if (e.key === 'Enter') {
            replaceTextareaWithH5();
        }
    });

    function replaceTextareaWithH5() {
        if (textarea.value === "" || textarea.value === "Type your description here...") {
            textarea.value = h5Description.textContent;
        }
        h5Description.textContent = textarea.value;
        divDescription.replaceChild(h5Description, textarea);
    }
}

export function editableToDoTitle(index, updateToDo) {
    let divs = document.querySelectorAll('#title-and-cross');
    let h3s = document.querySelectorAll('#todo');

    let div = divs[index];
    let h3 = h3s[index];

    let input = document.createElement('input');
    input.type = 'text';
    input.value = "Replace text with your todo";
    input.className = "editable-input-title";
    input.maxLength = 100;

    div.replaceChild(input, h3);

    input.select();

    input.addEventListener('blur', replaceInputWithH3);
    input.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            replaceInputWithH3();
        }
    });

    function replaceInputWithH3() {
        if (input.value === "" || input.value === "Replace text with your todo") {
            input.value = h3.textContent;
        }
        h3.textContent = input.value;
        div.replaceChild(h3, input);

        updateToDo(index, input.value);
    }
}