window.onload = function() {
    let div = document.getElementById('editable');
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
