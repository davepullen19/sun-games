
const result = document.getElementById('result');
const reset = document.getElementById('reset');
const buttons = document.querySelectorAll('.choice');

buttons.forEach(button => {
  button.addEventListener('click', () => {
    const answer = button.dataset.answer;

    buttons.forEach(b => b.disabled = true);

    result.classList.remove('hidden');

    if (answer === 'correct') {
      result.classList.add('correct');
      result.innerHTML = `
        <strong>Correct.</strong><br><br>
        If nobody entered the kitchen, the guard captain could not have inspected the room.
        Yet his boots are completely dry despite snow covering every entrance.
        Someone entered the castle — and lied about it.
      `;
    } else {
      result.classList.add('wrong');
      result.innerHTML = `
        <strong>Not quite.</strong><br><br>
        The contradiction is physical evidence.
        The snow means anyone entering would track in moisture.
        The dry boots expose the lie.
      `;
    }

    reset.classList.remove('hidden');
  });
});

reset.addEventListener('click', () => {
  location.reload();
});
