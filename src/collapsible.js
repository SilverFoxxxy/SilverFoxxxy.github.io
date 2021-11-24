
function updCollapsible() {
    let coll = document.getElementsByClassName("collapsible");
    let i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        let content = this.nextElementSibling;
        if (content.style.display === "block") {
            this.children[0].innerHTML = "&#9660";
            content.style.display = "none";
        } else {
            this.children[0].innerHTML = "&#9650";
            content.style.display = "block";
        }
      });
    }
}

updCollapsible();
