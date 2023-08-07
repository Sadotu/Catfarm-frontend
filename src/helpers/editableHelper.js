export function editableTitle() {
    let div = document.getElementById('task-header');
    let h3 = document.getElementById('editable-text');

    h3.addEventListener('dblclick', function() {
        // Create new input element
        let input = document.createElement('input');
        input.type = 'text';
        input.value = h3.textContent;

        // Replace h3 with input on double click
        div.replaceChild(input, h3);

        // Select the text in the input
        input.select();

        // When the user clicks away or presses enter, replace the input with the h3 again
        input.addEventListener('blur', replaceInputWithH3);
        input.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                replaceInputWithH3();
            }
        });

        function replaceInputWithH3() {
            // Set h3 text to input value
            h3.textContent = input.value;
            // Replace input with h3
            div.replaceChild(h3, input);
        }
    });
}

export function editableDescription() {
    let divDescription = document.getElementById('editable-description');
    let h5Description = document.getElementById('editable-text-description');

    h5Description.addEventListener('dblclick', function() {
        // Create new textarea element
        let textarea = document.createElement('textarea');
        textarea.rows = 10;
        textarea.cols = 90;
        textarea.value = h5Description.textContent;

        // Replace h5 with textarea on double click
        divDescription.replaceChild(textarea, h5Description);

        // Select the text in the textarea
        textarea.select();

        // When the user clicks away or presses enter, replace the textarea with the h5 again
        textarea.addEventListener('blur', replaceTextareaWithH5);
        textarea.addEventListener('keyup', function(e) {
            if (e.key === 'Enter') {
                replaceTextareaWithH5();
            }
        });

        function replaceTextareaWithH5() {
            // Set h5 text to textarea value
            h5Description.textContent = textarea.value;
            // Replace textarea with h5
            divDescription.replaceChild(h5Description, textarea);
        }
    });
}