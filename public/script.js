function judgeArguments() {
  const arg1 = document.getElementById('arg1').value;
  const arg2 = document.getElementById('arg2').value;
  const verdictDiv = document.getElementById('verdictOutput');
  verdictDiv.innerText = "Thinking...";

  axios.post('/api/judge', { arg1, arg2 })
    .then(res => {
      verdictDiv.innerText = res.data.result;
    })
    .catch(err => {
      verdictDiv.innerText = "Error: " + (err.response?.data?.error || "Something went wrong.");
    });
}
function lookupWord() {
  const word = document.getElementById('wordInput').value;
  const output = document.getElementById('definitionOutput');
  output.innerText = "Looking up...";

  axios.post('/api/define', { word })
    .then(res => {
      output.innerText = res.data.definition;
    })
    .catch(err => {
      output.innerText = "Error: " + (err.response?.data?.error || "Something went wrong.");
    });
}
