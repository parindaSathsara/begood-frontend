let check = document.getElementById("check");
let number = document.getElementById("number");
let text = document.getElementById("text");


let regex = /^[\w,\s,\@]/;
let regex2 = /^[\d]/
let regex3 = /[@]/;



function validationCheck(){
    if (number.value == "") {
        text.innerText = "Please Enter Your Vehicle Number";
        text.style.color = "#fff";
    } else if (number.value.length > 9) {
        text.innerText = "Invalid Length";
        text.style.color = "#da3400";
    } else if (number.value.match(regex)) {

        if (number.value.match(regex2)) {
            text.innerText = "Old";
            text.style.color = "rgba(4,125,9,1)";
        } else if (number.value.match(regex3)) {
            text.innerText = "Vintage";
            text.style.color = "rgba(4,125,9,1)";
        } else {
            text.innerText = "Modern";
            text.style.color = "rgba(4,125,9,1)";
        }
    } else {
        text.innerText = "Oops! Your Vehicle Number Is Invalid";
        text.style.color = "#da3400";
    }
}
