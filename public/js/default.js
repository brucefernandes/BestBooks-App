



function searchLibrary(){

	let entered = document.getElementById("searchBar").value;
	console.log(entered);

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
	    if (this.readyState == 4 && this.status == 200) {

			document.getElementById("library").innerHTML = "";
			let search_data = JSON.parse(this.responseText)

			search_data.forEach( index => {
				let d = document.createElement('div');
				d.className = "card grey"

				let a = document.createElement('a');
				a.href = "http://localhost:3000/books/" + index.isbn;
				a.target = "_blank";

				let span = document.createElement('span');
				span.className = "card-title  white-text"
				span.innerHTML = index.title + " by " + index.author ;

				a.appendChild(span)
				d.appendChild(a)
				let div = document.getElementById("library");
				div.appendChild(d);
				//div.appendChild(document.createElement("br"));


			})
		   }
	 }
	xhttp.open("POST", `http://localhost:3000/someBooks?search=${entered}`, true);
	xhttp.send();


}
