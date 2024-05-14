window.onload = function() {
const blockSpeed = 0.3;
        let currentRegex='';
        let currentMatch='';
        let currentMismatch='';
        let lives = 3;
        let scorePoints = 0;
        let isFalling = true;

        document.getElementById('game-over').style.display = 'none';
        document.getElementById('success-message').style.display = 'none';

        const url = window.location.href;
        const levelNumber = url[url.length - 6];    
        const path = `./level${levelNumber}.json`;

        async function getRegexData() {
            const response = await fetch(path);
            const data = await response.json();
            const keys = Object.keys(data);
            const randomKey = keys[Math.floor(Math.random() * keys.length)];
            console.log("hi");
            return {regex: randomKey, ...data[randomKey]};
        }

        function createBlock(blockText) {
            const block = document.createElement('div');
            block.classList.add('block');
            block.innerText = blockText;
            const minPositionVw = 20; 
            const maxPositionVw = 80; 
            const randomPositionVw = Math.random() * (maxPositionVw - minPositionVw) + minPositionVw;
            block.style.left = randomPositionVw + 'vw';
            document.body.appendChild(block);

            const fallInterval = setInterval(() => {
                if (isFalling) {
                    const top = parseFloat(block.style.top) || 0;
                    block.style.top = top + blockSpeed + 'px';

                    if (top > window.innerHeight - window.innerHeight * 0.19) {
                        clearInterval(fallInterval);
                        document.body.removeChild(block);
                        lives--;
                        let hearts = '';
                        for(let i = 0; i < lives; i++) {
                            hearts += '❤️';
                        }
                        document.getElementById('lives').innerText = hearts;
                        if(lives===0) {
                            isFalling = false;
                            document.getElementById('game-over').style.display = 'flex';
                        }
                        setButtonValues();
                    }
                }
            }, 10);
        }

        const btn1 = document.getElementById('btn1');
        const btn2 = document.getElementById('btn2');
        const btn3 = document.getElementById('btn3');

        async function setButtonValues() {
            const data = await getRegexData();
            currentRegex = data.regex;
            currentMatch = data.match;
            currentMismatch = data.mismatch;
            const correctButton = Math.floor(Math.random() * 3);
            [btn1, btn2, btn3][correctButton].innerText = currentMatch;
            [btn1, btn2, btn3].filter((_, i) => i !== correctButton).forEach(btn => {
                btn.innerText = data.mismatch[Math.floor(Math.random() * data.mismatch.length)];
            });
            createBlock(data.regex);
        }

        setButtonValues();

        [btn1, btn2, btn3].forEach(btn => {
            btn.addEventListener('click', async () => {
                if (btn.innerText === currentMatch) {
                    const oldBlock = document.querySelector('.block');
                    if (oldBlock) {
                        document.body.removeChild(oldBlock);
                    }
                    if(scorePoints === 9) {
                        document.getElementById('success-message').style.display = 'flex';
                        isFalling = false;
                    }

                    setButtonValues();
                    if(scorePoints < 10){
                        scorePoints++;
                        let progressBar = document.getElementById("progress-bar");   
                        let width = scorePoints * 10;
                        progressBar.style.width = width + '%'; 
                    }
                } else {
                    lives--;
                    let hearts = '';
                    for(let i = 0; i < lives; i++) {
                        hearts += '❤️';
                    }
                    document.getElementById('lives').innerText = hearts;
                }
                if(lives===0) {
                    isFalling = false;
                    document.getElementById('game-over').style.display = 'flex';
                    const oldBlock = document.querySelector('.block');
                    if (oldBlock) {
                        document.body.removeChild(oldBlock);
                    }
                    btn1.disabled=true;
                    btn2.disabled=true;
                    btn3.disabled=true;
                }
            });
        });

        document.addEventListener('keydown', (event) => {
            const key = event.key; 
            switch (key) {
                case '1':
                    btn1.click();
                    let button1 = document.getElementById('btn1');
                    button1.style.backgroundColor = '#fff';
                    setTimeout(function() {
                        button1.style.backgroundColor = '#f0f0f0';
                    }, 100);
                    break;
                case '2':
                    btn2.click();
                    let button2 = document.getElementById('btn2');
                    button2.style.backgroundColor = '#fff';
                    setTimeout(function() {
                        button2.style.backgroundColor = '#f0f0f0';
                    }, 100);
                    break;
                case '3':
                    btn3.click();
                    let button3 = document.getElementById('btn3');
                    button3.style.backgroundColor = '#fff';
                    setTimeout(function() {
                        button3.style.backgroundColor = '#f0f0f0';
                    }, 100);
                    break;
                default:
                    break;
            }
        });

        document.addEventListener('keydown', (event) => {
            if(event.key === "Enter") {
                isFalling = !isFalling;
            }
        });
};