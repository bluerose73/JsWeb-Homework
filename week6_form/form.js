var weightOutput = document.getElementById('weightOutput');
var weightInput = document.getElementById('weight');

function updateWeightOutput(){
    var weight = weightInput.value
    weightOutput.textContent = weight + ' kg'
}

weightInput.oninput = updateWeightOutput

var form = document.forms.signIn;

function check() {
    var gender = form.gender.value;
    var womensVolleyball = document.getElementById('womensVolleyball');
    console.log(womensVolleyball);
    if (gender == 'm' && womensVolleyball.checked){
            var warning = document.getElementById('warning');
            warning.innerHTML = '男子不能报名女子排球';
            return false;
        }
    return true;
}

form.onsubmit = check;
