let randomColors = ["#C21010","#277BC0","#54BAB9","#002B5B","#781C68","#F65A83"];

function chooseRandomColor() {
    return Math.floor(Math.random() * 6);
}

let tags = document.getElementsByClassName("grid-container");


for(let i =0; tags.length > i; i++) {
    let color = chooseRandomColor();
    console.log(color)
    tags[i].style.backgroundColor = randomColors[color];
    tags[i].style.boxShadow = '2px 2px 10px '+ randomColors[color];
}

