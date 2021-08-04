const pageFunctions = (function () {
    let maxNum = 2475; //max num of chapters
    let panelCount = 3; //num of comic panels shown
    let pageSelected = 2; // selected comic

    //make call on page load to get the latest page number
    fetch("https://xkcd.vercel.app/?comic=latest").then((res) => {
        res.json().then((result) => {
            maxNum = result.num;
            document.querySelector("#comicOrigin").innerHTML = `Contains ${maxNum} pages of comics from <a href="https://xkcd.com/">XKCD</a>`;
        });
    });

    return {
        //Function to call comic api with given page number
        getComic: (pageNum) => {
            fetch(`https://xkcd.vercel.app/?comic=${pageNum}`)
                .then(
                    function (response) {
                        if (response.status !== 200) {
                            console.log('Looks like there was a problem. Status Code: ' +
                                response.status);
                            return;
                        }
                        // Load Comic data
                        response.json().then(function (data) {
                            pageFunctions.loadData(data);

                        });
                    }
                )
                .catch(function (err) {
                    console.log('Fetch Error', err);
                });

            //Create Comic Panel
            document.querySelector("#comicRow").innerHTML += `
            <div id="comicPanel${pageNum}" class="comicPanel"  >
                <img src="https://cdn.dribbble.com/users/1032122/screenshots/14335044/media/0e40882794cbab3f6a0025bf4474fd86.gif"
                    width="100%">
                <h4>loading...</h4>
                <h5>#</h5>
            </div>`;
        }, loadComic: () => { // load comic

            document.querySelector("#comicRow").innerHTML = ""; // clear comic panel row

            // calculate the starting page number based on selected page number and number of panels
            let mid = Math.floor(panelCount / 2);
            let start = pageSelected - mid;

            for (let i = 0; i < panelCount; i++) {
                let page = (start + i) % maxNum;
                // console.log(page);
                if (page > 0) { // if normal
                    pageFunctions.getComic(page);
                } else if (page < 0) { // if number less than 0, start from max number
                    pageFunctions.getComic(page + maxNum);
                } else { // if number = 0 means last page
                    pageFunctions.getComic(maxNum);

                }

            };
        },


        //next page button
        nextClick: () => {
            pageSelected = (pageSelected + panelCount) % maxNum; //to ensure it always loop back to page 1
            pageFunctions.loadComic();

        },

        //previous button
        previousClick: () => {
            pageSelected = pageSelected + maxNum - panelCount; //to enure it loops back to last page after page 1
            pageFunctions.loadComic();

        },


        //Create comicPanel 
        loadData: (comic) => {
            // get comic panel elements
            let comicDiv = document.querySelector(`#comicPanel${comic.num} img`);
            let modal = document.querySelector('#modal');
            let modalImg = document.querySelector("#imgModal");

            // change img src
            comicDiv.src =
                `${comic.img}`;

            // set modal on click (to enlarge the image selected)
            comicDiv.onclick = function () {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
            // set title and page number
            document.querySelector(`#comicPanel${comic.num} h4`).innerHTML = `${comic.title}`;
            document.querySelector(`#comicPanel${comic.num} h5`).innerHTML = `${comic.num}`;

        },

        //Change Panel Count;
        changePanel: () => {
            const val = document.querySelector("#panelCount").value;
            panelCount = Number(val);

            pageFunctions.loadComic(); //reload the comics
        },

        //Handle Search event
        searchComic: () => {
            const input = document.querySelector("#inputBox").value; //get search value
            if (input > maxNum || input < 1) {
                alert(`Please input a number between 1 and ${maxNum}`);
            } else {
                pageSelected = Number(input); //assign selected page
                pageFunctions.loadComic(); // reload comics to selected page
            }

        },

        //Random page
        randomPage: () => {
            pageSelected = Math.ceil(Math.random() * maxNum); //randomize a number
            pageFunctions.loadComic(); // reload comics to selected page
        },

        //Close Modal
        closeModal: () => {
            let modal = document.querySelector('#modal');
            modal.style.display = "none";
        }
    };
})();


window.onload = () => {
    pageFunctions.loadComic(); //show comic on page load
}