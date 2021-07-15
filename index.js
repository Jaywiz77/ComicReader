const mainFunctions = (function () {
    let maxNum = 2475; //max num of chapters
    let panelCount = 3; //num of comic panels shown
    let pageSelected = 2; // selected comic

    // modal variables
    let modal = document.querySelector('#modal');
    let modalImg = document.querySelector("#imgModal");
    fetch("https://xkcd.vercel.app/?comic=latest").then((res) => {
        res.json().then((result) => {
            maxNum = result.num;
        });
    });

    return {
        //Function to all comic api
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
                            mainFunctions.loadData(data);

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
        }, loadComic: () => {
            // load comic
            document.querySelector("#comicRow").innerHTML = "";

            let mid = Math.floor(panelCount / 2);
            let start = pageSelected - mid;
            for (let i = 0; i < panelCount; i++) {
                let page = (start + i) % maxNum;
                console.log(page);
                if (page > 0) {
                    mainFunctions.getComic(page);
                    // console.log(page);
                } else if (page < 0) {
                    mainFunctions.getComic(page + maxNum);
                } else {
                    mainFunctions.getComic(maxNum);
                    // console.log(maxNum);
                }

            };
        },


        //next button
        nextClick: () => {
            pageSelected = (pageSelected + panelCount) % maxNum;
            mainFunctions.loadComic();

        },

        //previous button
        previousClick: () => {
            pageSelected = pageSelected + maxNum - panelCount;
            mainFunctions.loadComic();

        },


        //Create comicPanel 
        loadData: (comic) => {
            let comicDiv = document.querySelector(`#comicPanel${comic.num} img`);
            // change img
            comicDiv.src =
                `${comic.img}`;

            // set modal on click
            comicDiv.onclick = function () {
                modal.style.display = "block";
                modalImg.src = this.src;
            }
            // change title and page number
            document.querySelector(`#comicPanel${comic.num} h4`).innerHTML = `${comic.title}`;
            document.querySelector(`#comicPanel${comic.num} h5`).innerHTML = `${comic.num}`;

        },

        //Change Panel Count;
        changePanel: () => {
            const val = document.querySelector("#panelCount").value;
            panelCount = Number(val);
            mainFunctions.loadComic();
        },

        //Handle Search event
        searchComic: () => {
            const input = document.querySelector("#inputBox").value;
            if (input > maxNum || input < 1) {
                alert(`Please input a number between 1 and ${maxNum}`);
            } else {
                pageSelected = Number(input);
                mainFunctions.loadComic();
            }

        },

        //Random page
        randomPage: () => {
            let rand = Math.ceil(Math.random() * maxNum);
            pageSelected = rand;
            mainFunctions.loadComic();
        },

        //Close Modal
        closeModal: () => {
            modal.style.display = "none";
        }
    };
})();


window.onload = () => {
    mainFunctions.loadComic(); //show comic on page load
}